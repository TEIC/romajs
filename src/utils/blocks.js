export const content = {
  init: function() {
    this.setDeletable(false)
    this.jsonInit({
      type: 'content',
      message0: 'content',
      message1: '%1',
      args1: [{
        type: 'input_statement',
        name: 'references'
      }],
      colour: 210,
      tooltip: '(content model) contains the text of a declaration for the schema documented.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-content.html'
    })
  }
}

export const alternate = {
  init: function() {
    this.jsonInit({
      type: 'alternate',
      message0: 'alternate: min %1 max %2',
      args0: [
        {
          type: 'field_number',
          name: 'minOccurs',
          value: 0,
          min: 0,
          precision: 1
        },
        {
          type: 'field_number',
          name: 'maxOccurs',
          value: 0,
          min: 0,
          precision: 1
        }
      ],
      message1: '%1',
      args1: [{
        type: 'input_statement',
        name: 'references',
        check: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode']
      }],
      colour: 160,
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      tooltip: 'an alternation of references.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-alternate.html'
    })
  }
}

export const sequence = {
  init: function() {
    this.jsonInit({
      type: 'sequence',
      message0: 'sequence: min %1 max %2',
      args0: [
        {
          type: 'field_number',
          name: 'minOccurs',
          value: 0,
          min: 0,
          precision: 1
        },
        {
          type: 'field_number',
          name: 'maxOccurs',
          value: 0,
          min: 0,
          precision: 1
        }
      ],
      message1: '%1',
      args1: [{
        type: 'input_statement',
        name: 'references',
        check: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode']
      }],
      colour: 160,
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      tooltip: 'sequence of references.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-sequence.html'
    })
  }
}

export const elementRef = {
  init: function() {
    this.jsonInit({
      type: 'elementRef',
      message0: 'elementRef %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'elements',
          options: [
            [ 'element1', 'EL1' ],
            [ 'element2', 'EL2' ]
          ]
        }
      ],
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      colour: 230,
      tooltip: 'points to the specification for some element which is to be included in a schema.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-elementRef.html'
    })
  }
}

export const classRef = {
  init: function() {
    this.jsonInit({
      type: 'classRef',
      message0: 'classRef %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'classes',
          options: [
            [ 'class1', 'C1' ],
            [ 'class2', 'C2' ]
          ]
        }
      ],
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      colour: 230,
      tooltip: 'points to the specification for an attribute or model class which is to be included in a schema.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-classRef.html'
    })
  }
}

export const dataRef = {
  init: function() {
    this.jsonInit({
      type: 'dataRef',
      message0: 'dataRef %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'datatypes',
          options: [
            [ 'data1', 'D1' ],
            [ 'data2', 'D2' ]
          ]
        }
      ],
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      colour: 230,
      tooltip: 'points to the specification for some element which is to be included in a schema.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-dataRef.html'
    })
  }
}

export const macroRef = {
  init: function() {
    this.jsonInit({
      type: 'macroRef',
      message0: 'macroRef %1',
      args0: [
        {
          type: 'field_dropdown',
          name: 'macros',
          options: [
            [ 'macro1', 'M1' ],
            [ 'macro2', 'M2' ]
          ]
        }
      ],
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      colour: 230,
      tooltip: 'points to the specification for some pattern which is to be included in a schema.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-macroRef.html'
    })
  }
}

export const anyElement = {
  init: function() {
    this.jsonInit({
      type: 'anyElement',
      message0: 'anyElement: require %1 except %2',
      args0: [{
        type: 'field_input',
        name: 'require',
        text: ''
      }, {
        type: 'field_input',
        name: 'except',
        text: ''
      }],
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      colour: 330,
      tooltip: 'indicates the presence of any elements in a content model.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-anyElement.html'
    })
  }
}

export const empty = {
  init: function() {
    this.jsonInit({
      type: 'empty',
      message0: 'empty',
      previousStatement: 'empty',
      colour: 330,
      tooltip: 'indicates the presence of an empty node within a content model.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-empty.html'
    })
  }
}

export const textNode = {
  init: function() {
    this.jsonInit({
      type: 'textNode',
      message0: 'textNode',
      previousStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      nextStatement: ['alternate', 'sequence', 'elementRef', 'classRef', 'dataRef', 'macroRef', 'anyElement', 'textNode'],
      colour: 330,
      tooltip: 'indicates the presence of a text node in a content model.',
      helpUrl: 'http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-textNode.html'
    })
  }
}
