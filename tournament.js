function showPrizePool(poolNumber, clickedButton) {
    let allPools = document.querySelectorAll('.prize-pool');
    allPools.forEach(pool => pool.style.display = 'none');
    document.getElementById('prizePool' + poolNumber).style.display = 'block';
    let allButtons = document.querySelectorAll('.button-container button');
    allButtons.forEach(button => button.classList.remove('active-button'));
    clickedButton.classList.add('active-button');
    let allPrizeDetails = document.querySelectorAll('.prize-detail');
    allPrizeDetails.forEach(detail => detail.style.display = 'none');
}
function showPrizeDetail(poolNumber, detailNumber) {
    let allPools = document.querySelectorAll('.prize-pool');
    allPools.forEach(pool => pool.style.display = 'none');
    let allPrizeDetails = document.querySelectorAll('.prize-detail');
    allPrizeDetails.forEach(detail => detail.style.display = 'none');
    document.getElementById('prizeDetail' + poolNumber + '_' + detailNumber).style.display = 'block';
}
function goBackToPrizePool() {
    let allPrizeDetails = document.querySelectorAll('.prize-detail');
    allPrizeDetails.forEach(detail => detail.style.display = 'none');
    let visiblePool = document.querySelector('.active-button').id.replace('btn', '');
    document.getElementById('prizePool' + visiblePool).style.display = 'block';
}