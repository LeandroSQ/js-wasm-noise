@inline
function setPixel(width: i32, x: i32, y: i32, r: u8, g: u8, b: u8, a: u8): void {
    // Calculate the pixel index, converting 2d coords to 1d
    let offset: i32 = (y * width + x) * 4;

    // R
    store<u8>(offset, r);
    // G
    store<u8>(offset + 1, g);
    // B
    store<u8>(offset + 2, b);
    // A
    store<u8>(offset + 3, a);
}

export function render(width: i32, height: i32): void {
    for (let y: i32 = 0; y < height; y++) {
        for (let x: i32 = 0; x < width; x++) {
            // Randomly selects between black and white
            let v: u8 = Math.random() <= 0.5 ? 0xff : 0x00;
            
            // Set the pixel
            setPixel(width, x, y, v, v, v, 255);
        }
    }
}