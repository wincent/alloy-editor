import ButtonTwitter from '../../../src/components/buttons/button-twitter.jsx';

var assert = chai.assert;
var Simulate = ReactTestUtils.Simulate;

describe('ButtonTwitter', function() {
	before(Utils.createAlloyEditor);

	after(Utils.destroyAlloyEditor);

	beforeEach(Utils.beforeEach);

	afterEach(Utils.afterEach);

	it('should add ae-twitter-link', function() {
		bender.tools.selection.setWithHtml(this.nativeEditor, '{tweet}');

		var buttonTwitter = this.render(<ButtonTwitter />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonTwitter));

		assert.strictEqual(
			1,
			document.getElementsByClassName('ae-twitter-link').length
		);
	});

	it('should create link to tweet the word that is selected', function() {
		bender.tools.selection.setWithHtml(this.nativeEditor, '{tweet}');

		var buttonTwitter = this.render(<ButtonTwitter />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonTwitter));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		assert.strictEqual(
			'<p><a class="ae-twitter-link" href="https://twitter.com/intent/tweet?text=tweet" target="_blank">tweet</a></p>',
			data
		);
	});

	it('should add class which represents pressed button', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'<a class="ae-twitter-link" href="https://twitter.com/intent/tweet?text=tweet" target="_blank">{tweet}</a>'
		);

		var buttonTwitter = this.render(<ButtonTwitter />, this.container);

		var buttonDOMNode = ReactDOM.findDOMNode(buttonTwitter);

		assert.strictEqual(
			buttonDOMNode.classList.contains('ae-button-pressed'),
			true
		);
	});

	it('should remove link to tweet when button is pressed and the selection text is link to tweet', function() {
		bender.tools.selection.setWithHtml(
			this.nativeEditor,
			'<a class="ae-twitter-link" href="https://twitter.com/intent/tweet?text=tweet" target="_blank">{tweet}</a>'
		);

		var buttonTwitter = this.render(<ButtonTwitter />, this.container);

		Simulate.click(ReactDOM.findDOMNode(buttonTwitter));

		var data = bender.tools.getData(this.nativeEditor, {
			fixHtml: true,
			compatHtml: true,
		});

		assert.strictEqual('<p>tweet</p>', data);
	});
});
