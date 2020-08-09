function getRandom(min, max){
    return Math.round(Math.random() * (max - min) + min)
}


function AddCardTable(cardnumber = 0){
	$('.board-cards').empty();
	for (var i = 0; i < cardnumber; i++) {
		var top = getRandom(20, 200);
		var left = getRandom(45, 540);
		var rotation = getRandom(0, 45);
		$('.board-cards').append('<div class="card-pl bg table-'+(i+1)+' active tb-card"></div>');
		$('.table-'+(i+1)).css('top', top +'px');
		$('.table-'+(i+1)).css('left', left +'px');
		$('.table-'+(i+1)).css('transform', 'rotate('+rotation+'deg)');
	}
}