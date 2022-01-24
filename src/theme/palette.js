function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}
const palette = {
  primary: '#30ab78',
  background: '#f5f7f6',
  button: 'linear-gradient(to right, #06beb6 0%, #48b1bf  51%, #06beb6  100%)'
};
export default palette;
