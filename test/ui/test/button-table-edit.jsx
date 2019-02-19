import ButtonTableEdit from '../../../src/components/buttons/button-table-edit.jsx';

var assert = chai.assert;
var TestUtils = ReactTestUtils;
var Simulate = ReactTestUtils.Simulate;

var KEY_ENTER = 13;
var KEY_ESC = 27;

var getFixture = Utils.getFixture('test/ui/test/fixtures');

describe('ButtonTableEdit', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should create a 3x3 table by default when clicking on the confirm button', function() {
		var buttonTableEdit = this.render(
			<ButtonTableEdit cancelExclusive={sinon.stub()} />,
			this.container
		);

		var confirmButton = TestUtils.findRenderedDOMComponentWithTag(
			buttonTableEdit,
			'button'
		);

		Simulate.click(ReactDOM.findDOMNode(confirmButton));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		var expected = getFixture('3_by_3_empty_table.html');

		assert.strictEqual(data, expected);
	});

	it('should create a 6 x 4 table based on the rows and cols inputs when clicking on the confirm button', function() {
		var buttonTableEdit = this.render(
			<ButtonTableEdit cancelExclusive={sinon.stub()} />,
			this.container
		);

		Simulate.change(buttonTableEdit.rowsRef.current, {
			target: {value: 6},
		});
		Simulate.change(buttonTableEdit.colsRef.current, {
			target: {value: 4},
		});

		var confirmButton = TestUtils.findRenderedDOMComponentWithTag(
			buttonTableEdit,
			'button'
		);

		Simulate.click(ReactDOM.findDOMNode(confirmButton));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		var expected = getFixture('6_by_4_table.html');

		assert.strictEqual(data, expected);
	});

	it('should create a 6 x 4 table based on the rows and cols inputs when pressing enter on the rows input', function() {
		var buttonTableEdit = this.render(
			<ButtonTableEdit cancelExclusive={sinon.stub()} />,
			this.container
		);

		Simulate.change(buttonTableEdit.rowsRef.current, {
			target: {value: 6},
		});
		Simulate.change(buttonTableEdit.colsRef.current, {
			target: {value: 4},
		});

		Simulate.keyDown(buttonTableEdit.rowsRef.current, {
			keyCode: KEY_ENTER,
		});

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		var expected = getFixture('6_by_4_table.html');

		assert.strictEqual(data, expected);
	});

	it('should create a 6 x 4 table based on the rows and cols inputs when pressing enter on the cols input', function() {
		var buttonTableEdit = this.render(
			<ButtonTableEdit cancelExclusive={sinon.stub()} />,
			this.container
		);

		Simulate.change(buttonTableEdit.rowsRef.current, {
			target: {value: 6},
		});
		Simulate.change(buttonTableEdit.colsRef.current, {
			target: {value: 4},
		});

		Simulate.keyDown(buttonTableEdit.rowsRef.current, {
			keyCode: KEY_ENTER,
		});

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		var expected = getFixture('6_by_4_table.html');

		assert.strictEqual(data, expected);
	});

	it('should not create a table and dismiss the ui when pressing escape on the rows input', function() {
		var cancelExclusive = sinon.stub();

		var buttonTableEdit = this.render(
			<ButtonTableEdit cancelExclusive={cancelExclusive} />,
			this.container
		);

		bender.tools.selection.setWithHtml(this.nativeEditor, '');

		Simulate.keyDown(buttonTableEdit.rowsRef.current, {
			keyCode: KEY_ESC,
		});

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		assert.strictEqual(data, '');
		assert.ok(cancelExclusive.called);
		assert.strictEqual(1, cancelExclusive.callCount);
	});

	it('should not create a table and dismiss the ui when pressing escape on the cols input', function() {
		var cancelExclusive = sinon.stub();

		var buttonTableEdit = this.render(
			<ButtonTableEdit cancelExclusive={cancelExclusive} />,
			this.container
		);

		bender.tools.selection.setWithHtml(this.nativeEditor, '');

		Simulate.keyDown(buttonTableEdit.colsRef.current, {
			keyCode: KEY_ESC,
		});

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		assert.strictEqual(data, '');
		assert.ok(cancelExclusive.called);
		assert.strictEqual(1, cancelExclusive.callCount);
	});
});
