document.getElementById('enter-button').addEventListener('click', function() {
    document.getElementById('image-upload').click();
});

document.getElementById('image-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        const img = new Image();
        img.src = reader.result;
        img.onload = function() {
            document.getElementById('uploaded-image').src = '';
            document.getElementById('uploaded-image').src = reader.result;
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '0';
            document.getElementById('image-wrapper').appendChild(canvas); // Append canvas to image wrapper
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            canvas.addEventListener('mousemove', handleCanvasMove); // Listen for mouse move events on the canvas
            canvas.addEventListener('mouseleave', hideMagnifier); // Listen for mouse leave events on the canvas
            canvas.addEventListener('click', handleCanvasClick); // Listen for click events on the canvas
        };
    };
    reader.readAsDataURL(file);
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('color-popup').style.display = 'none';
});

document.getElementById('alpha-slider').addEventListener('input', function() {
    updateColorWithAlpha(this.value); // Update the color with the selected alpha value
});

function handleCanvasMove(event) {
    showMagnifier(event); // Show magnifier at current mouse position
}

function handleCanvasClick(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const ctx = event.target.getContext('2d');
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    const a = pixelData[3] / 255; // Alpha value normalized to range [0, 1]
    const colorValue = rgbToHex(r, g, b);
    const baseColor = rgbToHex(Math.min(r + 50, 255), Math.min(g + 50, 255), Math.min(b + 50, 255)); // Lighter shade of the chosen color
    document.getElementById('color-popup').style.display = 'block';
    document.getElementById('color-box').style.backgroundColor = colorValue;
    document.getElementById('color-value').textContent = `Color Value: ${colorValue}`;
    document.getElementById('color-rgb').textContent = `RGB Value: (${r}, ${g}, ${b})`;
    document.getElementById('base-color-box').style.backgroundColor = baseColor;

    document.getElementById('base-color-value').textContent = `Base Color Value: ${baseColor}`;
    document.getElementById('base-color-rgb').textContent = `Base RGB Value: (${Math.min(r + 50, 255)}, ${Math.min(g + 50, 255)}, ${Math.min(b + 50, 255)})`;
    const totalBaseColor = Math.min(r + 50, 255) + Math.min(g + 50, 255) + Math.min(b + 50, 255); // Total value of RGB components of the base color
    const totalChosenColor = r + g + b; // Total value of RGB components of the chosen color
    const percentage = Math.round((totalChosenColor / totalBaseColor) * 100);
    document.getElementById('color-composition').textContent = `Percentage of base color in chosen color: ${percentage}%`;
}

function showMagnifier(event) {
    const magnifier = document.getElementById('magnifier');
    magnifier.style.display = 'block'; // Show magnifier
    magnifier.style.left = `${event.offsetX - magnifier.offsetWidth / 2}px`; // Position magnifier at mouse X coordinate
    magnifier.style.top = `${event.offsetY - magnifier.offsetHeight / 2}px`; // Position magnifier at mouse Y coordinate
}

function hideMagnifier() {
    document.getElementById('magnifier').style.display = 'none'; // Hide magnifier on mouse leave
}

function rgbToHex(r, g, b) {
    const rHex = (r < 16 ? '0' : '') + r.toString(16);
    const gHex = (g < 16 ? '0' : '') + g.toString(16);
    const bHex = (b < 16 ? '0' : '') + b.toString(16);
    return `#${rHex}${gHex}${bHex}`;
}

function updateColorWithAlpha(alpha) {
    const colorBox = document.getElementById('color-box');
    const colorBoxStyle = window.getComputedStyle(colorBox);
    const backgroundColor = colorBoxStyle.backgroundColor;
    const rgbValues = backgroundColor.match(/\d+/g);
    const adjustedRgbValues = rgbValues.map(value => Math.round(value * alpha));
    const hexCode = rgbToHex(adjustedRgbValues[0], adjustedRgbValues[1], adjustedRgbValues[2]);
    colorBox.style.opacity = alpha;
    document.getElementById('color-rgb').textContent = `RGB Value: (${adjustedRgbValues[0]}, ${adjustedRgbValues[1]}, ${adjustedRgbValues[2]})`;
    document.getElementById('color-value').textContent = `Color Value: ${hexCode}`;
}
