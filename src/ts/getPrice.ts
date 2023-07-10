
let getPrice = (_id: number) => {
  if (_id <= 50) {
    return 0.01;
  } else if (_id <= 85) {
    return 0.03;
  } else if (_id <= 125) {
    return 0.05;
  } else if (_id <= 200) {
    return 0.1;
  } else if (_id <= 220) {
    return 0.3;
  } else if (_id <= 255) {
    return 0.5;
  } else if (_id <= 280) {
    return 1;
  } else if (_id <= 320) {
    return 2;
  } else if (_id <= 340) {
    return 3;
  } else if (_id <= 350) {
    return 4;
  } else if (_id <= 370) {
    return 5;
  } else if (_id <= 380) {
    return 8;
  } else if (_id <= 390) {
    return 55;
  } else if (_id <= 395) {
    return 88;
  } else if (_id <= 400) {
    return 555;
  } else if (_id <= 410) {
    return 888;
  } else if (_id <= 420) {
    return 5555;
  }
}

export default getPrice