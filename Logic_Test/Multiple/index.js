function sumOfMultiples(number) {

    let numberBelow = number - 1;  
    let numberOftiga = Math.floor(numberBelow / 3);
    let numberOflima = Math.floor(numberBelow / 5);  
    let multiples = [];
    let multipleOftiga = 0;
    let multipleOflima = 0;

    for (var i = 0; i < numberOftiga; i++) {
      multiples.push(multipleOftiga += 3);
    }

    for (var j = 0; j < numberOflima; j++) {
      multiples.push(multipleOflima += 5);
    }

    return multiples
              .filter((item, index) => multiples.indexOf(item) === index)
              .reduce((a, b) => a + b);    
 }