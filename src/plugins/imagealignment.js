import SelectionTest from '../selections/selection-test.js';

if (!CKEDITOR.plugins.get('ae_imagealignment')) {
	/**
	 * Enum for supported image alignments
	 * @type {Object}
	 */
	let IMAGE_ALIGNMENT = {
		CENTER: 'center',
		LEFT: 'left',
		RIGHT: 'right',
	};

	/**
	 * Enum values for supported image alignments
	 * @type {Array}
	 */
	let ALIGN_VALUES = [
		IMAGE_ALIGNMENT.LEFT,
		IMAGE_ALIGNMENT.RIGHT,
		IMAGE_ALIGNMENT.CENTER,
	];

	/**
	 * Necessary styles for the center alignment
	 * @type {Array.<Object>}
	 */
	let CENTERED_IMAGE_STYLE = [
		{
			name: 'display',
			value: 'block',
		},
		{
			name: 'margin-left',
			value: 'auto',
		},
		{
			name: 'margin-right',
			value: 'auto',
		},
	];

	/**
	 * Retrieves the alignment value of an image.
	 *
	 * @param {CKEDITOR.dom.element} image The image element
	 * @return {String} The alignment value
	 */
	let getImageAlignment = function(image) {
		let imageAlignment = image.getStyle('float');

		if (
			!imageAlignment ||
			imageAlignment === 'inherit' ||
			imageAlignment === 'none'
		) {
			imageAlignment = image.getAttribute('align');
		}

		if (!imageAlignment) {
			let centeredImage = CENTERED_IMAGE_STYLE.every(function(style) {
				let styleCheck = image.getStyle(style.name) === style.value;

				if (!styleCheck && style.vendorPrefixes) {
					styleCheck = style.vendorPrefixes.some(function(
						vendorPrefix
					) {
						return (
							image.getStyle(vendorPrefix + style.name) ===
							style.value
						);
					});
				}

				return styleCheck;
			});

			if (!imageAlignment) {
				let imageContainer = image.$.parentNode;

				if (imageContainer.style.textAlign == IMAGE_ALIGNMENT.CENTER) {
					CENTERED_IMAGE_STYLE.forEach(function(style) {
						image.setStyle(style.name, style.value);

						if (style.vendorPrefixes) {
							style.vendorPrefixes.forEach(function(
								vendorPrefix
							) {
								image.setStyle(
									vendorPrefix + style.name,
									style.value
								);
							});
						}
					});
					centeredImage = true;
				}
			}

			imageAlignment = centeredImage ? IMAGE_ALIGNMENT.CENTER : null;
		}

		return imageAlignment;
	};

	/**
	 * Removes the alignment value of an image
	 *
	 * @param {CKEDITOR.dom.element} image The image element
	 * @param {String} imageAlignment The image alignment value to be removed
	 */
	let removeImageAlignment = function(image, imageAlignment) {
		if (
			imageAlignment === IMAGE_ALIGNMENT.LEFT ||
			imageAlignment === IMAGE_ALIGNMENT.RIGHT
		) {
			image.removeStyle('float');

			if (imageAlignment === getImageAlignment(image)) {
				image.removeAttribute('align');
			}
		} else if (imageAlignment === IMAGE_ALIGNMENT.CENTER) {
			CENTERED_IMAGE_STYLE.forEach(function(style) {
				image.removeStyle(style.name);

				if (style.vendorPrefixes) {
					style.vendorPrefixes.forEach(function(vendorPrefix) {
						image.removeStyle(vendorPrefix + style.name);
					});
				}
			});

			let imageContainer = image.$.parentNode;

			if (imageContainer.style.textAlign == IMAGE_ALIGNMENT.CENTER) {
				imageContainer.style.textAlign = '';
			}
		}
	};

	/**
	 * Sets the alignment value of an image
	 *
	 * @param {CKEDITOR.dom.element} image The image element
	 * @param {String} imageAlignment The image alignment value to be set
	 */
	let setImageAlignment = function(image, imageAlignment) {
		removeImageAlignment(image, getImageAlignment(image));

		if (
			imageAlignment === IMAGE_ALIGNMENT.LEFT ||
			imageAlignment === IMAGE_ALIGNMENT.RIGHT
		) {
			image.setStyle('float', imageAlignment);
		} else if (imageAlignment === IMAGE_ALIGNMENT.CENTER) {
			CENTERED_IMAGE_STYLE.forEach(function(style) {
				image.setStyle(style.name, style.value);

				if (style.vendorPrefixes) {
					style.vendorPrefixes.forEach(function(vendorPrefix) {
						image.setStyle(vendorPrefix + style.name, style.value);
					});
				}
			});

			let imageContainer = image.$.parentNode;

			imageContainer.style.textAlign = IMAGE_ALIGNMENT.CENTER;
		}
	};

	/**
	 * CKEditor plugin which modifies the justify commands to properly align images. This
	 * plugin is an excerpt of CKEditor's original image one that can be found at
	 * https://github.com/ckeditor/ckeditor-dev/blob/master/plugins/image/plugin.js
	 *
	 * @class CKEDITOR.plugins.ae_imagealignment
	 */
	CKEDITOR.plugins.add('ae_imagealignment', {
		/**
		 * Initialization of the plugin, part of CKEditor plugin lifecycle.
		 * The function registers a 'paste' event on the editing area.
		 *
		 * @method afterInit
		 * @param {Object} editor The current editor instance
		 */
		afterInit: function(editor) {
			let self = this;

			ALIGN_VALUES.forEach(function(value) {
				let command = editor.getCommand('justify' + value);

				if (command) {
					command.on('exec', function(event) {
						let selectionData = editor.getSelectionData();

						if (
							selectionData &&
							SelectionTest.image({
								data: {selectionData: selectionData},
							})
						) {
							let image = selectionData.element;

							let imageAlignment = getImageAlignment(image);

							if (imageAlignment === value) {
								removeImageAlignment(image, value);
							} else {
								setImageAlignment(image, value);
							}

							event.cancel();

							self.refreshCommands(
								editor,
								new CKEDITOR.dom.elementPath(image)
							);
						}
					});

					command.on('refresh', function(event) {
						let selectionData = {
							element: event.data.path.lastElement,
						};

						if (
							SelectionTest.image({
								data: {selectionData: selectionData},
							})
						) {
							let imageAlignment = getImageAlignment(
								selectionData.element
							);

							this.setState(
								imageAlignment === value
									? CKEDITOR.TRISTATE_ON
									: CKEDITOR.TRISTATE_OFF
							);

							event.cancel();
						}
					});
				}
			});
		},

		/**
		 * Forces a refresh of the modified justify commands. This is needed because the applied changes
		 * do not modify the selection, so the refresh is never triggered and the UI does not update
		 * properly until the next selectionChange event.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance
		 * @param {CKEDITOR.dom.elementPath} elementPath The path of the selected image
		 */
		refreshCommands: function(editor, elementPath) {
			ALIGN_VALUES.forEach(function(value) {
				let command = editor.getCommand('justify' + value);

				if (command) {
					command.refresh(editor, elementPath);
				}
			});
		},
	});
}
