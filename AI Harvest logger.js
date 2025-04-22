// crops-model.js - Custom trained for Ugandan varieties
export async function assessHarvestQuality(imageFile) {
  const model = await tf.loadGraphModel('models/ug-crops-v3.json');
  const imgTensor = tf.browser.fromPixels(imageFile)
    .resizeNearestNeighbor([224, 224])
    .toFloat();
  
  // Normalize for Kampala lighting conditions
  const normalized = imgTensor.div(255.0).expandDims();
  const predictions = model.predict(normalized).dataSync();
  
  return {
    qualityGrade: ['Reject', 'Fair', 'Premium'][predictions[0]],
    diseaseRisk: predictions[1] > 0.7 ? 'High' : 'Low',
    recommendedPrice: 1500 * predictions[2] // UGX-adjusted
  };
}