import * as CAL from 'src/index.js';

var group = new CAL.Group({canvas: document.getElementById("CAL")});

var image = new CAL.Image('./img/tanks_sheet.png');

group.add(image);

image.load(() => {
	group.draw();
});