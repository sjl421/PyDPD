/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
This file contains a class for representation of a dataset which can be used
for data science. It also provides functionality for reading a storing a dataset
from file.

Original Programmer: Michael J. Siers
*/

"use strict";

/**
 * Reads in the input file from the event and returns a Dataset object
 * representing it.
 * @param {Event} event The event which was fired when a user uploads a file
 * or files to a web element.
 */
function input_file_to_dataset(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  // Determine the file type.
  var file_extension = file.name.split(".")[1];

  reader.onload = function(event) {
    if (file_extension.toLowerCase() === "arff") {
      return parse_ARFF(event.target.result);
    }
    if (file_extension.toLowerCase() === "csv") {
      return parse_CSV(event.target.result);
    }
    // If this point is reached, then the file extension has not been recognised
    alert("Filetype not recognised.");
    return null;
  };
  reader.readAsText(file);
}

/**
 * Parses an .ARFF file.
 * @param {String} The .ARFF file represented as a String
 * @returns {Dataset} The result as a Dataset object.
 */
function parse_ARFF(file_string) {
  var lines = file_string.split("\n");

  var line_index = 0;
  // Iterate over lines until the relation tag is found.
  while (!(lines[line_index].toLowerCase().startsWith("@relation "))) {
    line_index++;
  }
  // The current line index should be the dataset name.
  var name = lines[line_index].toLowerCase().split("@relation ")[1];

  // Iterate over lines until an attribute tag is found.
  while (!(lines[line_index].toLowerCase().startsWith("@attribute "))) {
    line_index++;
  }

  // Parse the following attributes.
  var attribute_names = [];
  var attribute_types = [];
  var categorical_values = [];
  while (lines[line_index].toLowerCase().startsWith("@attribute ")) {
    var current_line = lines[line_index];
    var attribute_string = current_line.toLowerCase().split("@attribute ")[1];

    // Split the string by " ". The attribute name should be in the first
    // position
    var splits = attribute_string.split(" ");
    attribute_names.push(splits[0]);

    // Check whether the current attribute is numeric or nominal
    if (splits[1].startsWith("numeric")) {  // The attribute is numeric
      attribute_types.push("numeric");
    }
    else if (splits[1].startsWith("{")) {  // The attribute is nominal
      attribute_types.push("nominal");
      // Take the substring from the original line string that starts with "{"
      // This has to be done since there may be whitespace inside the braces.
      var values_string = attribute_string.split("{")[1];

      // Cut out all the whitespaces here since they are meaningless and have
      // potential to make parsing the attribute names harder.
      values_string = values_string.replace(/\s/g, '');

      // Now cut off the last character ("}"), then separate the string by ",".
      values_string = values_string.slice(0, -1);
      categorical_values = values_string.split(",");
    }

    line_index++;
  }

  // Iterate over lines until the data tag is found.
  while (!(lines[line_index].toLowerCase().startsWith("@data"))) {
    line_index++;
  }

  // Parse the following records.
  var records = [];
  while (lines[line_index]) {
    var record_string = lines[line_index];

    // Remove whitespace for parsing simplicity.
    record_string = record_string.replace(/\s/g, '');
    var record_values = record_string.split(",");

    records.push(new Record(record_values));

    line_index++;
  }

  // Output the dataset to console for testing
  var dataset = new Dataset(name, records, attribute_names, attribute_types,
    categorical_values);
  console.log(dataset);

  return new Dataset(name, records, attribute_names, attribute_types,
    categorical_values);
}

/**
 * Parses a .csv file.
 * @param {String} The .csv file represented as a String
 * @returns {Dataset} The result as a Dataset object.
 */
function parse_CSV(file_string) {
  var lines = file_string.split("\n");

  // Read in the header line.
  var attribute_names = lines[0].split(",");

  // Start reading in the data, starting at the second line.
  var records = [];
  var lineIndex = 1;
  while (lineIndex < lines.length) {
    var record_values = lines[lineIndex].split(",");
    records.push(new Record(record_values));

    lineIndex++;
  }

  // TODO: Generate a list of all the values for each attribute.
  var attribute_values = [];

  // TODO: Guess the attribute types.

  // TODO: Calculate the possible values.

  // TODO: Determine a suitable name.

}

// ---- ---- ---- HELPER FUNCTIONS ---- ---- ----

/**
 * Given a set of attribute's values, this function returns an intelligent guess
 * of the attribute's type. Each attribute will either be 'numeric' or
 * 'nominal'. This is done by predicting each values' type (numeric or nominal)
 * then finally predicting the attribute's type as the most commonly predicted
 * value type.
 *
 * @param {String|Array} attribute_values An array of all the values that appear
 * at least once within the Records array of a
 * Dataset object.
 *
 * @returns {String} "Numeric" if the attribute is predicted as numeric,
 * "Categorical" if the attribute is predicted as categorical.
 */
function predict_attribute_type(attribute_values) {
  // Counts for nominal and numeric predictions
  var numeric_count = 0;
  var nominal_count = 0;

  // Loop over all attribute values, if the current value is predicted as a
  // number, then increment the numeric count, otherwise increment the nominal
  // count.
  var values_index = 0;
  while (attribute_values[values_index]) {
    if (!isNaN(attribute_values[values_index])) {
      numeric_count++;
    }
    else {
      nominal_count++;
    }
  }

  // Return the most commonly predicted value type.
  // NOTE: This function will return "Categorical" if the votes are equal.
  if (numeric_count > nominal_count) {
    return "Numeric";
  }
  else {
    return "Categorical";
  }
}

// ---- ---- ---- CLASS DEFINITIONS ---- ---- ----

/**
 * @class
 * @classdesc For representing a record within a dataset.
 */
var Record = function(attribute_values) {
  /** @member {String[]} */
  this.attribute_values = attribute_values;  // e.g., (1, 34, 'red', TRUE)
}

/**
 * Returns the the record's value which has the index passed to the function.
 * @param {Number} index - The index of the attribute to get the value of.
 * @returns {String} This Record object's value at the requested index.
 */
Record.prototype.get_value = function(index) {
  return this.attribute_values[index];
}

/**
 * @class
 * @classdesc For representing a dataset.
 */
var Dataset = function(name, records, attribute_names, attribute_types,
    categorical_values) {
  /**
   * The name of the dataset. For example, "adult" or "Breast Cancer". (These
   * are the names of two popular datasets.)
   * @member {String}
   */
  this.name = name;
  /**
   * The records which make up the dataset.
   * @member {Records[]}
   */
  this.records = records;
  /**
   * The names of the attributes. For example: "age", "salary", or "job".
   * @member {String[]}
   */
  this.attribute_names = attribute_names;
  /**
   * The types of the attributes. The possible values are "NUMERIC" and
   * "CATEGORICAL"
   * @member {String[]}
   */
  this.attribute_types = attribute_types;
  /**
   * The categorical values for each attribute. If the attribute for a given
   * index is not categorical, then it is an empty list.
   * This is a multidimensional array. The first index is the attribute index,
   * and the second attribute is the index of the attribute type.
   * This can be written as:
   * (categorical_values[<attribute_index>][<categorical_value>])
   * Example categorical values: {"TEACHER", "CHEF", "ACADEMIC", "JANITOR"}.
   * @member {String[][]}
   */
  this.categorical_values = categorical_values;
  /**
   * The numerical minimum value for each attribute. If the attribute for a
   * given index is not numeric, then it is Number.NaN.
   * For example, to find the minimum value of the numeric attribute A, first
   * get the value of attribute A for each Record object in this Dataset object.
   * Then, find the minimum value in this list of values.
   * @member {Number[]}
   */
  this.min_numeric_values
  /**
   * The numerical maximum value for each attribute. If the attribute for a
   * given index is not numeric, then it is Number.NaN.
   * For example, to find the maximum value of the numeric attribute A, first
   * get the value of attribute A for each Record object in this Dataset object.
   * Then, find the maximum value in this list of values.
   * @member {Number[]}
   */
  this.max_numeric_values
}

/**
 * Gets the name of the Dataset object.
 * @returns {String} The name of this Dataset object.
 */
Dataset.prototype.get_name = function() {
  return this.name;
}

/**
 * Returns the record from the dataset at the passed index.
 * @param {Number} index The index of the record to get.
 * @returns {Record} The record at the requested index.
 */
Dataset.prototype.get_record = function(index) {
  return this.records[index];
}

/**
 * Returns the name of the attribute at the passed index.
 * @param {Number} index The index of the attribute to get the name of.
 * @returns {String} The name of the attribute at the requested index.
 */
Dataset.prototype.get_attribute_name = function(index) {
  return this.attribute_names[index];
}

/**
 * Returns the type of the attribute at the passed index.
 * @param {Number} index The index of the attribute to get the type of.
 * @returns {String} The type of the attribute at the requested index.
 * Represented as a string; either "NUMERIC" or "CATEGORICAL".
 */
Dataset.prototype.get_attribute_type = function(index) {
  return this.attribute_types[index];
}

/**
 * Returns the possible values for the attribute at the passed index.
 * @param {Number} index The index of the attribute to get the possible values
 * of.
 * @returns {String[]} The possible values of the attribute at the requested
 * index. An array is returned which consists of the possible values.
 */
Dataset.prototype.get_categorical_values = function(index) {
  return this.categorical_values[index];
}

/**
 * Returns the minimum value for the attribute at the passed index. If the
 * attribute is not numeric, then Number.NaN is returned.
 * @param {Number} index The index of the attribute to get the minimum value
 * of.
 * @returns {Number} The minimum value for the attribute at the passed index.
 * If the attribute is not numeric, then Number.NaN is returned.
 */
Dataset.prototype.get_min_numeric_value = function(index) {
  return this.min_numeric_values[index];
}

