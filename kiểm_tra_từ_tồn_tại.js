const fs = require('fs');

function kiểm_tra_từ_tồn_tại(cụm_từ) 
{
  const danh_sách_từ = fs.readFileSync('./TuVung.txt', 'utf-8').split('\n').map(line => line.trim());
  return danh_sách_từ.includes(cụm_từ);
}

module.exports = kiểm_tra_từ_tồn_tại;