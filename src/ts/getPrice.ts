
let getPrice = (id: number) => {
  if(id >= 221 && id <= 246) {
    return 0.01
  } else if(id >= 130 && id <= 142) {
    return 0.01
  } else if(id >=  78 && id <= 103) {
    return 0.01
  } else if(id >=  13 && id <=  25) {
    return 0.01
  } else if(id >= 156 && id <= 181) {
    return 0.1
  } else if(id >=  52 && id <=  64) {
    return 0.1
  } else if(id >=  26 && id <=  38) {
    return 0.03
  } else if(id >= 208 && id <= 220) {
    return 0.3
  } else if(id >= 143 && id <= 155) {
    return 0.05
  } else if(id >=  39 && id <=  51) {
    return 0.05
  } else if(id >= 182 && id <= 207) {
    return 0.5
  } else if(id >= 117 && id <= 129) {
    return 0.5
  } else if(id >= 261 && id <= 278) {
    return 1
  } else if(id >= 279 && id <= 338) {
    return 2
  } else if(id >= 339 && id <= 398) {
    return 3
  } else if(id >=  65 && id <=  77) {
    return 4
  } else if(id >= 399 && id <= 418) {
    return 5
  } else if(id >= 104 && id <= 258) {
    return 55
  } else if (id == 116) {
    return 555
  } else if (id == 259) {
    return 888
  } else if (id >= 247 && id <= 258) {
    return 88
  } else {
    return 0.01
  }

}

export default getPrice