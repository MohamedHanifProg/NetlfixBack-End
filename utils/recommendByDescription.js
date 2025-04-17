// utils/recommendByDescription.js
const use = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs'); // במקום tfjs-node

async function recommendByDescription(likedOverviews, allPrograms) {
  if (likedOverviews.length === 0 || allPrograms.length === 0) return [];

  const model = await use.load();

  const userEmbedding = await model.embed(likedOverviews);
  const programEmbedding = await model.embed(allPrograms.map(p => p.overview || ''));

  const userAvg = tf.mean(userEmbedding, 0);

  const similarities = await tf
    .matMul(programEmbedding, userAvg.expandDims(1))
    .array();

  const results = allPrograms.map((program, index) => ({
    ...program,
    score: similarities[index][0],
  }));

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

module.exports = { recommendByDescription };
