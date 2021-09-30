

function isPalindrome(str) {
    var strLen = str.length,
        strReverse = str.split('').reverse().join(''); //Разбиваем строку посимвольно  и превращаем ее в массив с помощью split(''), потом применяем к нему метод reverse() и собираем все символы в строку с помощью join('')
    if (strReverse == str) {
      return 'yes';
    } else {
      return 'no';
    }
  }

  const test = isPalindrome('abcdedcba'),
  test2 = isPalindrome('abcded');

  console.log(test);
  console.log(test2);
  console.log('isPalindrome result: ' + 'str - ' + test + ' str2 - ' + test2);