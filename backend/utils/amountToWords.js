const units = [
  "", "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen",
  "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty",
  "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

const convertBelowThousand = (num) => {
  let str = "";

  if (num >= 100) {
    str += units[Math.floor(num / 100)] + " Hundred ";
    num = num % 100;
  }

  if (num >= 20) {
    str += tens[Math.floor(num / 10)] + " ";
    num = num % 10;
  }

  if (num > 0) {
    str += units[num] + " ";
  }

  return str.trim();
};

exports.amountToWords = (num) => {
  if (!num || num === 0) return "Zero";

  let result = "";

  if (num >= 10000000) {
    result += convertBelowThousand(Math.floor(num / 10000000)) + " Crore ";
    num %= 10000000;
  }

  if (num >= 100000) {
    result += convertBelowThousand(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }

  if (num >= 1000) {
    result += convertBelowThousand(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }

  if (num > 0) {
    result += convertBelowThousand(num);
  }

  return result.trim();
};
