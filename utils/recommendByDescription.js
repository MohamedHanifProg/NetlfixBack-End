// utils/recommendByDescription.js
const use = require('@tensorflow-models/universal-sentence-encoder');
const tf  = require('@tensorflow/tfjs');

let model;                                       // cached instance

async function loadModel() {
  if (!model) model = await use.load();          // one‑time download
  return model;
}

/**
 * Recommends programs by semantic similarity between positive‑rated reviews
 * and program descriptions.
 *
 * @param {string[]} likedOverviews  – review texts (4★ or 5★ only)
 * @param {object[]} allPrograms     – Program docs from MongoDB
 * @param {number[]} weights         – rating weights (same length as likedOverviews)
 * @returns {object[]}               – sorted list with similarity score
 */
async function recommendByDescription(likedOverviews, allPrograms, weights = []) {
  if (!likedOverviews.length || !allPrograms.length) return [];

  /* 1 ▸ embeddings */
  const model  = await loadModel();
  const revVec = await model.embed(likedOverviews);                 // N×512
  const prgVec = await model.embed(allPrograms.map(p => p.overview || '')); // M×512

  /* 2 ▸ taste vector (weighted average) */
  let taste;
  if (weights.length === likedOverviews.length) {
    const w = tf.tensor(weights);                                   // shape N
    const weighted = revVec.mul(w.expandDims(1));                   // N×512
    taste = tf.sum(weighted, 0).div(tf.sum(w));                     // 1×512
    w.dispose(); weighted.dispose();
  } else {
    taste = tf.mean(revVec, 0);                                     // fallback
  }

  /* 3 ▸ cosine‑ish similarity */
  const sims = await tf
    .matMul(prgVec, taste.expandDims(1))  // M×1
    .array();                             // plain JS

  /* 4 ▸ shape for frontend + score */
  const results = allPrograms.map((p, i) => {
    const raw = p.toObject?.() || p;
    return {
      ...raw,
      id:            raw.externalId,
      media_type:    raw.mediaType,
      poster_path:   raw.posterPath,
      backdrop_path: raw.backdropPath,
      score:         sims[i][0],
    };
  });

  /* 5 ▸ cleanup GPU/CPU memory */
  revVec.dispose(); prgVec.dispose(); taste.dispose();

  /* 6 ▸ ranked top‑10 */
  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

module.exports = { recommendByDescription };
