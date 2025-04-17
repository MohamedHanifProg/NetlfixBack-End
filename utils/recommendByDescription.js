const use = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs');


let model;

async function loadModel() {
  if (!model) {
    model = await use.load();
  }
  return model;
}

/**
 * Recommends programs by semantic similarity between user's review overviews and program descriptions.
 * @param {string[]} likedOverviews - Array of user review texts.
 * @param {object[]} allPrograms - Array of program objects (from MongoDB).
 * @returns {object[]} - Top 10 recommended programs with a `score` field.
 */
async function recommendByDescription(likedOverviews, allPrograms) {
  if (likedOverviews.length === 0 || allPrograms.length === 0) return [];

  const model = await loadModel();

  // Create embeddings for user reviews
  const userEmbedding = await model.embed(likedOverviews);

  // Create embeddings for all program overviews
  const programEmbedding = await model.embed(allPrograms.map(p => p.overview || ''));

  // Average user embedding
  const userAvg = tf.mean(userEmbedding, 0);

  // Compute similarity scores
  const similarities = await tf
    .matMul(programEmbedding, userAvg.expandDims(1))
    .array();

  // Attach similarity score and map necessary frontend fields
  const results = allPrograms.map((program, index) => {
    const raw = program.toObject?.() || program;
    return {
      ...raw,
      id: raw.externalId,
      media_type: raw.mediaType,
      poster_path: raw.posterPath,
      backdrop_path: raw.backdropPath,
      score: similarities[index][0],
    };
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

module.exports = { recommendByDescription };
