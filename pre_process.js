/**
 * Description.
 * Preprocess data with MinMaxScalar algorithm.
 * X_std = (X - X.min()) / (X.max() - X.min())
 * X_scaled = X_std * (max - min) + min
**/
const fs = require('fs');
var X_min = 0;
var X_max = 0;
var min_ = 0;
var max_ = 1;
/**
 * Write the minimum and maximum to be used for later scaling to a file.
 * Use the values for future transformation of data before model prediction.
**/
function write_util(){

	const fs = require('fs') 
	// Data which will write in a file. 
	let data = {"X_max":X_max, "X_min":X_min, "max_":max_, "min_":min_};
	  
	fs.writeFileSync('utils.json', JSON.stringify(data));
}
/**
 * fit data for preprocessing.
 * @param {Array} X - input data.
 * @param {integer} min - minimum value of the feature range.
 * @param {integer} max - maximum value of the feature range.
 * @return {Array} X_scaled - Final scaled array fitted within Feature Range.
**/
function fit(X, min=0, max=1){

    X_max = Math.max.apply(null,X)
    X_min = Math.min.apply(null,X)
    min_ = min;
    max_ = max;

	var X_minArr = X.map(function(values){
		return values - X_min
	});
	// X_std = (X - X.min()) / (X.max() - X.min())
	var X_std = X_minArr.map(function(values){
		return values / (X_max - X_min)
	});
	// X_scaled = X_std * (max - min) + min
	var X_scaled = X_std.map(function(values){
		return values*(max - min) + min
	});

    return X_scaled
}
/**
 * Fit to data, then transform it.
 * @param {Array} result - array of objects.
 * @param {String} attribute  - proprety of the JSON object to be accessed.
 * @return {Array} train_scaled - Final scaled array fitted within Feature Range.
**/
function fit_transform(result, attribute){
    var data = null;
    try{
    	data = result.map(value => value[attribute]);
    } catch (error) {
        console.log("attribute undefined.");
  
    }
	
    var train_scaled = fit(data);
    write_util();
    return train_scaled;
}
/**
 * Scale features of X according to feature_range.
 * @param {Array} result - array of objects.
 * @param {String} attribute  - proprety of the JSON object to be accessed.
 * @return {Array} X_scaled - Final scaled array fitted within Feature Range.
**/
function transform(result, attribute){
    var data = null;
    let fit = require('./utils.json');

	var data = null;
    try{
    	data = result.map(value => value[attribute]);
    } catch (error) {
        console.log("attribute undefined."); 
    }
    console.log(fit.X_max,fit.X_min)
    var X_minArr = data.map(function(values){
		return values - fit.X_min
	});
	var X_std = X_minArr.map(function(values){
		return values / (fit.X_max - fit.X_min)
	});
	var X_scaled = X_std.map(function(values){
		return values*(fit.max_ - fit.min_) + fit.min_
	});

    return X_scaled
}
/**
 * Undo the scaling of X according to feature_range.
 * @param {Array} inp - Scaled array according to feature_range.
 * @param {integer} min - minimum value of the feature range.
 * @param {integer} max - maximum value of the feature range.
 * @return {Array} X_ - Inverse Scaled Array.
**/
function inverse_transform(inp, min=0, max=1){
    
    let fit = require('./utils.json');
    
	var X = inp.map(function(values){
		return (values - min)/ (max - min)
	});
	var X_ = X.map(function(values){
		return values * (fit.X_max - fit.X_min) + fit.X_min
	});

	return X_
}

module.exports = { fit_transform, transform, inverse_transform }
