/*
 * Xpath0rLib originates from Xpath0r v1.5.0
 * Xpath0r v1.5.0 Copyright © Kevin Bouge
 * http://cz.linkedin.com/in/kevinbouge/
 * 
 *
 */

var Xpath0rLib = Xpath0rLib || {};

Xpath0rLib = (function() {

	"use strict";

	function Xpath0rLib(debug) {
		this.debug = debug || false;
	}

	Xpath0rLib.prototype = {

		getLog: function(message) {
			if(this.debug === true) {
				if(typeof(kango) !== "undefined") {
					kango.console.log("*** Xpath0rLib : " + message);
				}
				else if(typeof(console) !== "undefined") {
					console.log("*** Xpath0rLib : " + message);
				}
			}
		},

		evaluate: function(doc, xpath) {

			try {
				var t0 = performance.now(),
				nodes = doc.evaluate(xpath, doc, null, 0, null),
				t1 = performance.now();
				return {nodes: nodes, resultsTime: Math.round((t1 - t0) * 50)};
			}
			catch(e) {
				this.getLog("Error : evaluate : " + e);
			}
		},

		getResultsNumberAndTime: function(doc, xpath) {

			var resultsNumber = 0,
			execEval = this.evaluate(doc, xpath),
			node = {};

            try{
                if (typeof(execEval.nodes) !== "undefined") {
                    node = execEval.nodes.iterateNext();

                    while (node) {
                        resultsNumber = resultsNumber + 1;
                        node = execEval.nodes.iterateNext();
                    }
                }
            }catch(e) {
                this.getLog("Error : getResultsNumberAndTime : " + e);
                return {resultsNumber: resultsNumber, resultsTime: 99999999};
            }
			

			return {resultsNumber: resultsNumber, resultsTime: execEval.resultsTime};
		},

		getAttributes: function(element, attributesExceptions) {

			var i = 0,
			attributes = element.attributes,
			attributesLen = attributes.length,
			attributesName = [],
			attributeName = "",
			attributeValue = "";

			for (i = 0; i < attributesLen; i = i + 1) {
				attributeName = attributes[i].nodeName;
				attributeValue = attributes[i].value;

				this.getLog("getAttributes : attr: " + attributeName);

				if(typeof(attributeName) !== "undefined" && typeof(attributeValue) !== "undefined"  && attributesExceptions.indexOf(attributeName) === -1 &&
				attributeValue !== "") {
					attributesName.push({
						"name": attributeName,
						"value": attributeValue
						});
				}

			}

			return attributesName;
		},

		getSelectivity: function(doc, value) {
			var xpath = '//*[contains(@*, "' + value + '")]';
			return this.getResultsNumberAndTime(doc, xpath).resultsNumber;
		},

		sortValuesBySelectivity: function(doc, array) {

			var that = this;

			function compare(value1, value2) {
				var xpath1ResultNumber = 0,
				xpath2ResultNumber = 0;

				xpath1ResultNumber = that.getSelectivity(doc, value1);
				xpath2ResultNumber = that.getSelectivity(doc, value2);

				if (xpath1ResultNumber < xpath2ResultNumber) {
					return -1;
				}
				else if (xpath1ResultNumber > xpath2ResultNumber) {
					return 1;
				}

				return 0;
			}

			return array.sort(compare);

		},

		getMatchingValues: function(doc, value, valuesExceptions) {

			var original = value,
			values = [],
			valuesSplit = [],
			i = 0,
			valuesSplitLen = 0;

			value = value.replace(/http?:\/\//, "");
			value = value.replace(doc.location.hostname, "");

			value = value.replace(/(^\/[a-zA-Z][a-zA-Z]\/|^\/[a-zA-Z][a-zA-Z]-[a-zA-Z][a-zA-Z]\/|zh-Hans|zh-Hant)/, "");

			value = value.replace(/\W+/g, " ");
			value = value.replace(/\s+/g, " ");
			value = value.trim();

			valuesSplit = value.split(" ");
			valuesSplitLen = valuesSplit.length;

			for (i = 0; i < valuesSplitLen; i = i + 1) {
				if(typeof valuesSplit[i] !== "undefined") {
					if(valuesSplit[i].length > 1 && valuesExceptions.indexOf(valuesSplit[i]) === -1 && values.indexOf(valuesSplit[i]) === -1) {
						values.push(valuesSplit[i]);
					}
				}
			}

			values = this.sortValuesBySelectivity(doc, values);
			this.getLog("getMatchingValues : values : " + values);

			return values.slice(0, 2);

		},

		getXpathOneTag: function(element) {

			var xpaths = [],
			doc = element.ownerDocument,
			tag = element.tagName.toLowerCase(),
			xpath = "//" + tag,
			xpath2 = "",
			execEval = this.getResultsNumberAndTime(doc, xpath),
			nodes = {},
			i = 1;

			this.getLog("getXpathOneTag : xpath : " + xpath);

			if(execEval.resultsNumber === 1) {
				xpaths.push({xpath: xpath, score: execEval.resultsNumber + execEval.resultsTime});
			}
			else if(execEval.resultsNumber === 2) {
				for(i = 1; i < 3; i = i + 1) {
					xpath2 = "(" + xpath + ")[" + i + "]";
					nodes = this.evaluate(doc, xpath2);
                    try{
                       if (typeof(nodes) !== "undefined" && nodes.iterateNext() === element) {
                            xpaths.push({xpath: xpath2, score: execEval.resultsNumber + execEval.resultsTime});
                        } 
                    }catch(e) {
                        this.getLog("Error : getXpathOneTag : " + e);
                    }
				}
			}

			return xpaths;
		},

		getXpathEqualOneAttribute: function(element, attributesExceptions, equalAttributesExceptions) {

			var xpaths = [],
			doc = element.ownerDocument,
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			xpath = "",
			xpath2 = "",
			execEval = {},
			time = 0,
			nodes = {},
			j = 1;

			for (i = 0; i < attributesLen; i = i + 1) {
				if(equalAttributesExceptions.indexOf(attributes[i].name) === -1 && attributes[i].value.indexOf("http") === -1) {
					xpath = "//" + tag + "[@" + attributes[i].name + "=\"" + attributes[i].value + "\"]";
					this.getLog("getXpathEqualOneAttribute : xpath : " + xpath);

					execEval = this.getResultsNumberAndTime(doc, xpath);

					if(execEval.resultsNumber === 1) {
						xpaths.push({xpath: xpath, score: this.getSelectivity(doc, attributes[i].value) + execEval.resultsTime});
					}
					else if(execEval.resultsNumber === 2) {
						for(j = 1; j < 3; j = j + 1) {
							xpath2 = "(" + xpath + ")[" + j + "]";
							nodes = this.evaluate(doc, xpath2);
                            try{
                                if (typeof(nodes) !== "undefined" && nodes.iterateNext() === element) {
                                    xpaths.push({xpath: xpath2, score: this.getSelectivity(doc, attributes[i].value) + execEval.resultsTime});
                                }
                            }catch(e) {
                                this.getLog("Error : getXpathEqualOneAttribute : " + e);
                            }
							
						}
					}
				}

			}

			return xpaths;
		},

		getXpathEqualTwoAttributes: function(element, attributesExceptions, equalAttributesExceptions) {

			var doc = element.ownerDocument,
			xpaths = [],
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			j = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			attributePivot = {},
			xpath = "",
			execEval = {};

			for (i = 0; i < attributesLen; i = i + 1) {
				attributePivot = attributes[i];
				for (j = 0; j < attributesLen; j = j + 1) {
					if(i < j && equalAttributesExceptions.indexOf(attributePivot.name) === -1 && equalAttributesExceptions.indexOf(attributes[j].name) === -1 &&
					attributePivot.value.indexOf("http") === -1 && attributes[j].value.indexOf("http") === -1) {
						xpath = "//" + tag + "[@" + attributePivot.name + "=\"" + attributePivot.value + "\" and @" + attributes[j].name + "=\"" + attributes[j].value + "\"]";
						this.getLog("getXpathEqualTwoAttributes : xpath : " + xpath);
						execEval = this.getResultsNumberAndTime(doc, xpath);
						if(execEval.resultsNumber === 1) {
							xpaths.push({xpath: xpath, score: (this.getSelectivity(doc, attributePivot.value) + this.getSelectivity(doc, attributes[j].value) + execEval.resultsTime)});
						}
					}
				}
			}

			return xpaths;
		},

		getXpathContainOneAttribute: function(element, attributesExceptions, containAttributesExceptions, valuesExceptions) {

			var doc = element.ownerDocument,
			xpaths = [],
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			j = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			values = [],
			xpath = "",
			valuesLen = 0,
			execEval = {};

			for (i = 0; i < attributesLen; i = i + 1) {

				if(containAttributesExceptions.indexOf(attributes[i].name) === -1) {

					values = this.getMatchingValues(doc, attributes[i].value, valuesExceptions);
					valuesLen = values.length;

					for (j = 0; j < valuesLen; j = j + 1) {

						xpath = "//" + tag + "[contains(@" + attributes[i].name + ", \"" + values[j] + "\")]";
						this.getLog("getXpathContainOneAttribute : xpath : " + xpath);
						execEval = this.getResultsNumberAndTime(doc, xpath);
						if(execEval.resultsNumber === 1) {
							xpaths.push({xpath: xpath, score: this.getSelectivity(doc, values[j]) + execEval.resultsTime});
						}

					}

				}
			}

			return xpaths;
		},
        
        //lan_hd
        getXpathContainOneAttributeAndValue: function(element, attributesExceptions, containAttributesExceptions, valuesExceptions) {

			var doc = element.ownerDocument,
			xpaths = [],
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			j = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			value = "",
			xpath = "",
			execEval = {};

			for (i = 0; i < attributesLen; i = i + 1) {

				if(containAttributesExceptions.indexOf(attributes[i].name) === -1) {
                    
                    let attributesValue = attributes[i].value;
                    value = attributesValue.substring(0, 50);
                    xpath = "//" + tag + "[contains(@" + attributes[i].name + ", \"" + value + "\")]";
                    this.getLog("getXpathContainOneAttribute : xpath : " + xpath);
                    execEval = this.getResultsNumberAndTime(doc, xpath);
                    if(execEval.resultsNumber === 1) {
                        xpaths.push({xpath: xpath, score: this.getSelectivity(doc, value) + execEval.resultsTime});
                    }

				}
			}

			return xpaths;
		},

		getXpathContainTwoAttributes: function(element, attributesExceptions, containAttributesExceptions, valuesExceptions) {

			var doc = element.ownerDocument,
			xpaths = [],
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			j = 0,
			k = 0,
			m = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			attributePivot = {},
			xpath = "",
			values = [],
			valuesLen = 0,
			values2 = [],
			values2Len = 0,
			execEval = {};

			for (i = 0; i < attributesLen; i = i + 1) {
				attributePivot = attributes[i];
				values = this.getMatchingValues(doc, attributePivot.value, valuesExceptions);
				valuesLen = values.length;

				for (k = 0; k < valuesLen; k = k + 1) {

					for (j = 0; j < attributesLen; j = j + 1) {

						if(i < j && containAttributesExceptions.indexOf(attributePivot.name) === -1 && containAttributesExceptions.indexOf(attributes[j].name) === -1) {

							values2 = this.getMatchingValues(doc, attributes[j].value, valuesExceptions);
							values2Len = values2.length;

							for (m = 0; m < values2Len; m = m + 1) {

								xpath = "//" + tag + "[contains(@" + attributePivot.name + ", \"" + values[k] + "\") and contains(@" + attributes[j].name + ", \"" + values2[m] + "\")]";
								this.getLog("getXpathContainTwoAttributes : xpath : " + xpath);
								execEval = this.getResultsNumberAndTime(doc, xpath);
								if(execEval.resultsNumber === 1) {
									xpaths.push({xpath: xpath, score: (this.getSelectivity(doc, values[k]) + this.getSelectivity(doc, values2[m])) + execEval.resultsTime});
								}
							}
						}
					}
				}
			}

			return xpaths;
		},
        
        //lan_hd
        getXpathContainTwoAttributesAndValue: function(element, attributesExceptions, containAttributesExceptions, valuesExceptions) {

			var doc = element.ownerDocument,
			xpaths = [],
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			j = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			attributePivot = {},
			xpath = "",
			value = "",
			value2 = "",
			execEval = {};

			for (i = 0; i < attributesLen; i = i + 1) {
				attributePivot = attributes[i];
				//values = this.getMatchingValues(doc, attributePivot.value, valuesExceptions);
                let attributePivotValue = attributePivot.value;
                value = attributePivotValue.substring(0, 50);

                for (j = 0; j < attributesLen; j = j + 1) {

                    if(i < j && containAttributesExceptions.indexOf(attributePivot.name) === -1 && containAttributesExceptions.indexOf(attributes[j].name) === -1) {

//                        values2 = this.getMatchingValues(doc, attributes[j].value, valuesExceptions);
                        let attributePivotValue2 = attributes[j].value;
                        value2 = attributePivotValue2.substring(0, 50);

                        xpath = "//" + tag + "[contains(@" + attributePivot.name + ", \"" + value + "\") and contains(@" + attributes[j].name + ", \"" + value2 + "\")]";
                        this.getLog("getXpathContainTwoAttributes : xpath : " + xpath);
                        execEval = this.getResultsNumberAndTime(doc, xpath);
                        if(execEval.resultsNumber === 1) {
                            xpaths.push({xpath: xpath, score: (this.getSelectivity(doc, value) + this.getSelectivity(doc, value2)) + execEval.resultsTime});
                        }
                    }
                }
			}

			return xpaths;
		},

		getXpathEqualOneAttributeContainOneAttribute: function(element, attributesExceptions, equalAttributesExceptions, containAttributesExceptions, valuesExceptions) {

			var doc = element.ownerDocument,
			xpaths = [],
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			j = 0,
			m = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			attributePivot = {},
			xpath = "",
			value = "",
			values2 = [],
			values2Len = 0,
			execEval = {};

			for (i = 0; i < attributesLen; i = i + 1) {
				if(equalAttributesExceptions.indexOf(attributes[i].name) === -1) {
				attributePivot = attributes[i];
				value = attributePivot.value;

					for (j = 0; j < attributesLen; j = j + 1) {
						if(i < j && containAttributesExceptions.indexOf(attributes[j].name) === -1 && value.indexOf("http") === -1) {

							values2 = this.getMatchingValues(doc, attributes[j].value, valuesExceptions);
							values2Len = values2.length;

							for (m = 0; m < values2Len; m = m + 1) {

								xpath = "//" + tag + "[@" + attributePivot.name + "=\"" + value + "\" and contains(@" + attributes[j].name + ", \"" + values2[m] + "\")]";
								this.getLog("getXpathEqualOneAttributeContainOneAttribute : xpath : " + xpath);
								execEval = this.getResultsNumberAndTime(doc, xpath);
								if(execEval.resultsNumber === 1) {
									xpaths.push({xpath: xpath, score: (this.getSelectivity(doc, value) + this.getSelectivity(doc, values2[m])) + execEval.resultsTime});
								}
							}
						}
					}
				}
			}

			return xpaths;

		},
        
        //lan_hd
        getXpathEqualOneAttributeContainOneAttributeAndValue: function(element, attributesExceptions, equalAttributesExceptions, containAttributesExceptions, valuesExceptions) {

			var doc = element.ownerDocument,
			xpaths = [],
			attributes = this.getAttributes(element, attributesExceptions),
			i = 0,
			j = 0,
			m = 0,
			attributesLen = attributes.length,
			tag = element.tagName.toLowerCase(),
			attributePivot = {},
			xpath = "",
			value = "",
			value2 = "",
			execEval = {};

			for (i = 0; i < attributesLen; i = i + 1) {
				if(equalAttributesExceptions.indexOf(attributes[i].name) === -1) {
				attributePivot = attributes[i];
				value = attributePivot.value;

					for (j = 0; j < attributesLen; j = j + 1) {
						if(i < j && containAttributesExceptions.indexOf(attributes[j].name) === -1 && value.indexOf("http") === -1) {

//							values2 = this.getMatchingValues(doc, attributes[j].value, valuesExceptions);
//							values2Len = values2.length;
                            let attributesValue2 = attributes[j].value;
                            value2 = attributesValue2.substring(0, 50);

                            xpath = "//" + tag + "[@" + attributePivot.name + "=\"" + value + "\" and contains(@" + attributes[j].name + ", \"" + value2 + "\")]";
                            this.getLog("getXpathEqualOneAttributeContainOneAttribute : xpath : " + xpath);
                            execEval = this.getResultsNumberAndTime(doc, xpath);
                            if(execEval.resultsNumber === 1) {
                                xpaths.push({xpath: xpath, score: (this.getSelectivity(doc, value) + this.getSelectivity(doc, value2)) + execEval.resultsTime});
                            }
						}
					}
				}
			}

			return xpaths;

		},

		getArraysUnion: function(arrayOfArrays) {

			var i = 0,
			j = 0,
			res = [],
			arrayOfArraysLen = arrayOfArrays.length,
			arrayLength = 0,
			highestScore = 0;

			for (i = 0; i < arrayOfArraysLen; i = i + 1) {
				arrayLength = arrayOfArrays[i].length;
				for (j = 0; j < arrayLength; j = j + 1) {
					if(res.indexOf(arrayOfArrays[i][j]) === -1) {
					   if(arrayOfArrays[i][j].score > highestScore) {
							highestScore = arrayOfArrays[i][j].score;
						}
					   res.push(arrayOfArrays[i][j]);
					}
				}
			}

			function compare(xpath1, xpath2) {
				if (xpath1.score < xpath2.score) {
					return -1;
				}
				else if (xpath1.score > xpath2.score) {
					return 1;
				}
				else if (xpath1.xpath.length < xpath2.xpath.length) {
					return -1;
				}
				else if (xpath1.xpath.length > xpath2.xpath.length) {
					return 1;
				}
				return 0;
			}

			res.sort(compare);

			arrayLength = res.length;
			for (i = 0; i < arrayLength; i = i + 1) {
				res[i].score = Math.round(100 - (res[i].score * 100 / (highestScore * 2)));
			}

			return res;
		},

		getRelativeXpath: function(element, attributesExceptions, equalAttributesExceptions, containAttributesExceptions, valuesExceptions) {

			var xpaths = [];

			attributesExceptions = attributesExceptions || ["style", "title", "aria-label", "selected", "tabindex", "aria-hidden", "aria-level"];
			valuesExceptions = valuesExceptions || ["selected", "current"];
			equalAttributesExceptions = equalAttributesExceptions || ["href", "src", "class", "alt"];
			containAttributesExceptions = containAttributesExceptions || [];

			xpaths.push(this.getXpathOneTag(element));
            
			xpaths.push(this.getXpathEqualOneAttribute(element, attributesExceptions, equalAttributesExceptions));
			xpaths.push(this.getXpathEqualTwoAttributes(element, attributesExceptions, equalAttributesExceptions));
			
//            xpaths.push(this.getXpathContainOneAttribute(element, attributesExceptions, containAttributesExceptions, valuesExceptions));
//            xpaths.push(this.getXpathContainOneAttributeAndValue(element, attributesExceptions, containAttributesExceptions, valuesExceptions));
            
//			xpaths.push(this.getXpathContainTwoAttributes(element, attributesExceptions, containAttributesExceptions, valuesExceptions));
            xpaths.push(this.getXpathContainTwoAttributesAndValue(element, attributesExceptions, containAttributesExceptions, valuesExceptions));
            
//			xpaths.push(this.getXpathEqualOneAttributeContainOneAttribute(element, attributesExceptions, equalAttributesExceptions, containAttributesExceptions, valuesExceptions));
//            xpaths.push(this.getXpathEqualOneAttributeContainOneAttributeAndValue(element, attributesExceptions, equalAttributesExceptions, containAttributesExceptions, valuesExceptions));

			return this.getArraysUnion(xpaths);
		}

	};

	return Xpath0rLib;

}());

var Xpath0rLib = new Xpath0rLib();

