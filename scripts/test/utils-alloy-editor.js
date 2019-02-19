if (!window.Utils) {
	window.Utils = {};
}

window.Utils.assertDropdownCommandButtonResult = function assertDropdownCommandButtonResult(
	config
) {
	var assertResult = window.Utils.assertResult('test/ui/test/fixtures');

	var TestUtils = ReactTestUtils;
	var Simulate = TestUtils.Simulate;

	var command = function() {
		var dropdown = TestUtils.findAllInRenderedTree(
			config.buttonDropdown,
			function(component) {
				return TestUtils.isCompositeComponentWithType(
					component,
					config.buttonCommandsList
				);
			}
		);

		assert.ok(dropdown);
		assert.equal(1, dropdown.length);

		var commandButtons = TestUtils.findAllInRenderedTree(
			dropdown[0],
			function(component) {
				return (
					!TestUtils.isDOMComponent(component) &&
					component.props.command === config.buttonCommand
				);
			}
		);

		assert.ok(commandButtons.length);

		if (config.selectionFn) {
			config.selectionFn.call(this);
		}

		Simulate.click(ReactDOM.findDOMNode(commandButtons[0]));
	};

	assertResult.call(
		this,
		config.initialFixture,
		command,
		config.expectedFixture,
		config.errorMessage
	);
};

window.Utils.createAlloyEditor = function createAlloyEditor(done, config) {
	var editable = document.createElement('div');

	editable.setAttribute('id', 'editable');
	editable.setAttribute('contenteditable', true);

	document.getElementsByTagName('body')[0].appendChild(editable);

	this._editable = editable;

	assert.ok(bender);
	assert.ok(CKEDITOR);
	assert.ok(AlloyEditor);

	config = CKEDITOR.tools.merge(
		{
			toolbars: {},
		},
		config
	);

	this.editor = AlloyEditor.editable('editable', config);

	this.nativeEditor = this.editor.get('nativeEditor');

	this.nativeEditor.on(
		'instanceReady',
		function() {
			window.Utils.focusEditor(this.nativeEditor);

			done();
		}.bind(this)
	);

	this.render = function(component, container, editor) {
		editor = editor || this.editor;
		return ReactDOM.render(
			React.createElement(
				EditorContext.Provider,
				{value: {editor: editor}},
				component
			),
			container
		);
	}.bind(this);
};

window.Utils.destroyAlloyEditor = function destroyAlloyEditor(done) {
	if (this.editor) {
		this.editor.destroy();
	}

	this._editable.parentNode.removeChild(this._editable);

	if (done) {
		done();
	}
};
