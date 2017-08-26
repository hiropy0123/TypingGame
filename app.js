jQuery(function()
{
	Typing.init();
});

var Typing =
{
	init : function()
	{
    Typing.container = jQuery("#container");
		Typing.readyPage = jQuery("#readyPage");
		Typing.stagePage = jQuery("#stagePage");
		Typing.closePage = jQuery("#closePage");
		Typing.questionArea = jQuery("#question");
		Typing.commentArea = jQuery("#comment");
		Typing.inputArea = jQuery("#input");
		Typing.guideArea = jQuery("#guide");
		Typing.keyboards = jQuery("#keyboard .key");
		Typing.timerArea = jQuery(".timer");
		Typing.rightArea = jQuery(".right");
		Typing.wrongArea = jQuery(".wrong");
		Typing.retryButton = jQuery(".retry");
		Typing.rightPoint = 1;
		Typing.wrongPoint = 5;
		Typing.startKey = "J";

		Typing.ready();
	}
}

Typing.ready = function()
{
	Typing.second = 120;
	Typing.rightCount = 0;
	Typing.wrongCount = 0;
	Typing.datasIndex = [];

	for(var i = 0; i < Typing.datas.length; i++) Typing.datasIndex[i] = i;

	Typing.stagePage.hide();
	Typing.closePage.hide();
	Typing.right();
	Typing.wrong();

	Typing.readyPage.fadeIn();
	Typing.activeKeyboard(Typing.startKey);
	Typing.setTypingHandler(Typing.readyHandler);
}

Typing.readyHandler = function(e)
{
	if(Typing.codeToChar(e.keyCode, e.shiftKey) === Typing.startKey)
	{
		Typing.readyPage.hide();
		Typing.stagePage.show();
		Typing.timer();
		Typing.chooseQuestion();
	}
}

Typing.timer = function()
{
	Typing.timerHandler();
	Typing.timerID = setInterval(Typing.timerHandler, 1000);
}

Typing.timerHandler = function()
{
	if(Typing.second == 0)
	{
		clearInterval(Typing.timerID);
		Typing.close();
	}
	var m = Math.floor(Typing.second / 60);
	var s = Typing.second % 60;
	if(m < 10) m = "0" + m;
	if(s < 10) s = "0" + s;

	Typing.timerArea.text(m + ":" + s);
	Typing.second--;
}

Typing.chooseQuestion = function()
{
	var i = Math.floor(Math.random() * Typing.datasIndex.length);

	Typing.data = Typing.datas[Typing.datasIndex[i]];

	if(Typing.datasIndex.length > 5)
	{
		Typing.datasIndex.splice(i, 1);
	}
	Typing.input = "";
	Typing.characters = Typing.kanaToChar(Typing.data.kana);

	Typing.displayQuestion();
	Typing.displayComment();
	Typing.displayCharacters();
	Typing.activeKeyboard();
	Typing.setTypingHandler(Typing.typing);
}

Typing.typing = function(e)
{
	var chr = Typing.codeToChar(e.keyCode, e.shiftKey);

	if(chr)
	{
		var jadge = Typing.jadge(chr);

		if(jadge !== false)
		{
      Typing.container.removeClass('flash');
			if(jadge)
			{
				Typing.displayCharacters();
				Typing.activeKeyboard();
			}
			else
			{
				Typing.chooseQuestion();
			}
			Typing.rightCount++;
			Typing.right();
		}
		else
		{
			Typing.wrongCount++;
			Typing.wrong();
      Typing.container.addClass('flash');
		}
	}
}

Typing.jadge = function(chr)
{
	for(var i = 0; i < Typing.characters[0].length; i++)
	{
		if(Typing.characters[0][i].substr(0, 1) == chr)
		{
			Typing.input += chr;

			for(var i = 0; i < Typing.characters[0].length; i++)
			{
				if(Typing.characters[0][i].substr(0, 1) == chr)
				{
					Typing.characters[0][i] = Typing.characters[0][i].substr(1);

					if(Typing.characters[0][i].length == 0)
					{
						Typing.characters.shift();
						break;
					}
				}
				else
				{
					Typing.characters[0].splice(i, 1);
					i--;
				}
			}
			return Typing.characters.length;
		}
	}
	return false;
}

Typing.close = function()
{
  Typing.container.removeClass('flash');
	Typing.setTypingHandler();
	Typing.activeKeyboard(false);

  Typing.stagePage.hide();
	Typing.closePage.fadeIn(1000);

	Typing.closePage.find(".right").hide()
	                               .delay(1500)
	                               .fadeIn(500);
	Typing.closePage.find(".wrong").hide()
	                               .delay(2500)
	                               .fadeIn(500);
	Typing.closePage.find(".retry").hide()
	                               .delay(3500)
	                               .fadeIn(500)
	                               .unbind("retry")
	                               .click(Typing.ready);
	Typing.closePage.find(".level").hide()
	                               .delay(3500)
	                               .fadeIn(500)
	                               .find("span").text(Typing.mark());
}

Typing.right = function()
{
	Typing.rightArea.text("正解した文字数： " + Typing.rightCount);
}

Typing.wrong = function()
{
	Typing.wrongArea.text("間違えた文字数： " + Typing.wrongCount);
}

Typing.mark = function()
{
	var rightPoint = Typing.rightCount * Typing.rightPoint;
	var wrongPoint = Typing.wrongCount * Typing.wrongPoint;
	var point = rightPoint - wrongPoint;
	var level = "E";

	if      (point <  50) level = "E";
	else if (point <  75) level = "E+";
	else if (point < 125) level = "D-";
	else if (point < 150) level = "D";
	else if (point < 175) level = "D+";
	else if (point < 200) level = "C-";
	else if (point < 225) level = "C";
	else if (point < 250) level = "C+";
	else if (point < 275) level = "B-";
	else if (point < 300) level = "B";
	else if (point < 325) level = "B+";
	else if (point < 350) level = "A-";
	else if (point < 400) level = "A";
	else if (point < 450) level = "A+";
  else if (point < 700) level = "S";
	else level = "Great!!";

	return level;
}

Typing.kanaToChar = function(str)
{
	var characters = [];

	for(var i = 0; i < str.length; i++)
	{
		var list = [];
		var s1 = str.substr(i, 1);
		var s2 = str.substr(i + 1, 1);
		var s3 = str.substr(i + 2, 1);
		var s4 = str.substr(i + 3, 1);
		var c1 = s1 ? Typing.charTable[s1] : "";
		var c2 = s2 ? Typing.charTable[s2] : "";
		var c3 = s3 ? Typing.charTable[s3] : "";
		var c4 = s4 ? Typing.charTable[s4] : "";
		var cA = s1 && s2 ? Typing.charTable[s1 + s2] : "";
		var cB = s2 && s3 ? Typing.charTable[s2 + s3] : "";
		var cC = s3 && s4 ? Typing.charTable[s3 + s4] : "";

		if(cA)
		{
			for(var iA in cA) list.push(cA[iA]);
			for(var i1 in c1) for(var i2 in c2) list.push(c1[i1] + c2[i2])

			i = i + 1;
		}
		else if(s1 == "ン")
		{
			if(s2 == "ッ")
			{
				if(!c3 || c3[0].match(/^(A|I|U|E|O|N)/) || c3[0].length == 1)
				{
					list.push("NNXTU");
					list.push("NNLTU");
					list.push("NNXTSU");
					list.push("NNLTSU");
					list.push("NXTU");
					list.push("NLTU");
					list.push("NXTSU");
					list.push("NLTSU");

					i = i + 1;
				}
				else　if(cC)
				{
					for(var iC in cC)
					{
						list.push("NN"     + cC[iC].substr(0, 1) + cC[iC]);
						list.push("NNXTU"  + cC[iC]);
						list.push("NNLTU"  + cC[iC]);
						list.push("NNXTSU" + cC[iC]);
						list.push("NNLTSU" + cC[iC]);
						list.push("N"      + cC[iC].substr(0, 1) + cC[iC]);
						list.push("NXTU"   + cC[iC]);
						list.push("NLTU"   + cC[iC]);
						list.push("NXTSU"  + cC[iC]);
						list.push("NLTSU"  + cC[iC]);
					}
					for(var i3 in c3) for(var i4 in c4)
					{
						list.push("NN"     + c3[i3].substr(0, 1) + c3[i3] + c4[i4]);
						list.push("NNXTU"  + c3[i3] + c4[i4]);
						list.push("NNLTU"  + c3[i3] + c4[i4]);
						list.push("NNXTSU" + c3[i3] + c4[i4]);
						list.push("NNLTSU" + c3[i3] + c4[i4]);
						list.push("N"      + c3[i3].substr(0, 1) + c3[i3] + c4[i4]);
						list.push("NXTU"   + c3[i3] + c4[i4]);
						list.push("NLTU"   + c3[i3] + c4[i4]);
						list.push("NXTSU"  + c3[i3] + c4[i4]);
						list.push("NLTSU"  + c3[i3] + c4[i4]);
					}
					i = i + 3;
				}
				else
				{
					for(var i3 in c3)
					{
						list.push("NN"     + c3[i3].substr(0, 1) + c3[i3]);
						list.push("NNXTU"  + c3[i3]);
						list.push("NNLTU"  + c3[i3]);
						list.push("NNXTSU" + c3[i3]);
						list.push("NNLTSU" + c3[i3]);
						list.push("N"      + c3[i3].substr(0, 1) + c3[i3]);
						list.push("NXTU"   + c3[i3]);
						list.push("NLTU"   + c3[i3]);
						list.push("NXTSU"  + c3[i3]);
						list.push("NLTSU"  + c3[i3]);
					}
					i = i + 2;
				}
			}
			else if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/))
			{
				list.push("NN");
			}
			else if(cB)
			{
				for(var iB in cB)
				{
					list.push("NN" + cB[iB]);
					list.push("N" + cB[iB]);
				}
				for(var i2 in c2) for(var i3 in c3)
				{
					list.push("NN" + c2[i2] + c3[i3]);
					list.push("N" + c2[i2] + c3[i3]);
				}
				i = i + 2;
			}
			else
			{
				for(var i2 in c2)
				{
					list.push("NN" + c2[i2]);
					list.push("N" + c2[i2]);
				}
				i = i + 1;
			}
		}
		else if(s1 == "ッ")
		{
			if(!c2 || c2[0].match(/^(A|I|U|E|O|N)/) || c2[0].length == 1)
			{
				list.push("XTU");
				list.push("LTU");
				list.push("XTSU");
				list.push("LTSU");
			}
			else　if(cB)
			{
				for(var iB in cB)
				{
					list.push(cB[iB].substr(0, 1) + cB[iB]);
					list.push("XTU" + cB[iB]);
					list.push("LTU" + cB[iB]);
					list.push("XTSU" + cB[iB]);
					list.push("LTSU" + cB[iB]);
				}
				for(var i2 in c2) for(var i3 in c3)
				{
					list.push(c2[i2].substr(0, 1) + c2[i2] + c3[i3]);
					list.push("XTU" + c2[i2] + c3[i3]);
					list.push("LTU" + c2[i2] + c3[i3]);
					list.push("XTSU" + c2[i2] + c3[i3]);
					list.push("LTSU" + c2[i2] + c3[i3]);
				}
				i = i + 2;
			}
			else
			{
				for(var i2 in c2)
				{
					list.push(c2[i2].substr(0, 1) + c2[i2]);
					list.push("XTU" + c2[i2]);
					list.push("LTU" + c2[i2]);
					list.push("XTSU" + c2[i2]);
					list.push("LTSU" + c2[i2]);
				}
				i = i + 1;
			}
		}
		else
		{
			for(var i1 in c1) list.push(c1[i1]);
		}
		characters.push(list);
	}
	return characters;
}

Typing.codeToChar = function(keycode, shiftKey)
{
	if(Typing.codeTable[keycode])
	{
		return shiftKey ? Typing.codeTable[keycode][1] : Typing.codeTable[keycode][0];
	}
	return false;
}

Typing.charToCode = function(chr)
{
	for(var i in Typing.codeTable)
	{
		if(Typing.codeTable[i][0] == chr) return {code : i, shift : false};
		if(Typing.codeTable[i][1] == chr) return {code : i, shift : true};
	}
	return false;
}

Typing.setTypingHandler = function(eventHandler)
{
	jQuery(window).unbind("keydown");
	if(eventHandler) jQuery(window).bind("keydown", eventHandler);
}

Typing.displayQuestion = function()
{
	Typing.questionArea.text(Typing.data.question)
}

Typing.displayCharacters = function()
{
	var input = Typing.input;
	if(input.length > 5)
	input = input.substr(input.length - 5);

	var guide = input;
	for (var i in Typing.characters)
	guide += Typing.characters[i][0];

	Typing.inputArea.text(input);
	Typing.guideArea.text(guide);
}

Typing.displayComment = function()
{
	Typing.commentArea.text(Typing.data.comment)
}

Typing.activeKeyboard = function(nextChar)
{
	Typing.keyboards.removeClass("active");

	if(nextChar !== false)
	{
		if(!nextChar)
		nextChar = Typing.guideArea.text().substr(Typing.inputArea.text().length, 1);

		var nextCode = Typing.charToCode(nextChar);

		if(nextCode.shift)
    jQuery(".shift", Typing.keyboards2).addClass("active");
		jQuery(".key" + nextCode.code, Typing.keyboards2).addClass("active");
	}
}

// LOAD FROM JSON
// Typing.codeTable = $.getJSON("json/codeTable.json", function(codeTable)
// {
//   for(var i = 0; i < codeTable.length; i++)
//   {
//     var codeTable = codeTable[i];
//     //console.log(Typing.codeTable);
//   }
//   return codeTable;
// }
// );
// console.log(Typing.codeTable);


// Typing.charTable = $.getJSON("json/charTable.json", function(charTable)
// {
//   for(var i = 0; i < charTable.length; i++)
//   {
//     var charTable = charTable[i];
//   }
//   return charTable;
// }
// );


// Typing.datas = $.getJSON("json/datas.json", function(datas)
// {
//   for(var i = 0; i < datas.length; i++)
//   {
//     var datas = datas[i];
//   }
//   return datas;
// }
// );



Typing.codeTable = {
	 32 : [ " " , " " ],
	 48 : [ "0" , ""  ],
	 49 : [ "1" , "!" ],
	 50 : [ "2" , '"' ],
	 51 : [ "3" , "#" ],
	 52 : [ "4" , "$" ],
	 53 : [ "5" , "%" ],
	 54 : [ "6" , "&" ],
	 55 : [ "7" , "'" ],
	 56 : [ "8" , "(" ],
	 57 : [ "9" , ")" ],
	 59 : [ ":" , "+" ], // ブラウザ差異あり
	 65 : [ "A" , "A" ],
	 66 : [ "B" , "B" ],
	 67 : [ "C" , "C" ],
	 68 : [ "D" , "D" ],
	 69 : [ "E" , "E" ],
	 70 : [ "F" , "F" ],
	 71 : [ "G" , "G" ],
	 72 : [ "H" , "H" ],
	 73 : [ "I" , "I" ],
	 74 : [ "J" , "J" ],
	 75 : [ "K" , "K" ],
	 76 : [ "L" , "L" ],
	 77 : [ "M" , "M" ],
	 78 : [ "N" , "N" ],
	 79 : [ "O" , "O" ],
	 80 : [ "P" , "P" ],
	 81 : [ "Q" , "Q" ],
	 82 : [ "R" , "R" ],
	 83 : [ "S" , "S" ],
	 84 : [ "T" , "I" ],
	 85 : [ "U" , "U" ],
	 86 : [ "V" , "V" ],
	 87 : [ "W" , "W" ],
	 88 : [ "X" , "X" ],
	 89 : [ "Y" , "Y" ],
	 90 : [ "Z" , "Z" ],
	107 : [ ";" , "+" ], // ブラウザ差異あり
	109 : [ "-" , "=" ], // ブラウザ差異あり
	186 : [ ":" , "*" ], // ブラウザ差異あり
	187 : [ ";" , "+" ], // ブラウザ差異あり
	188 : [ "," , "<" ],
	189 : [ "-" , "=" ], // ブラウザ差異あり
	190 : [ "." , ">" ],
	191 : [ "/" , "?" ],
	192 : [ "@" , "`" ],
	219 : [ "[" , "{" ],
	220 : [ "\\", "|" ],
	221 : [ "]" , "}" ],
	222 : [ "^" , "~" ],
	226 : [ "\\", "_" ]
}
Typing.charTable = {
	"１"		: ["1"],
	"２"		: ["2"],
	"３"		: ["3"],
	"４"		: ["4"],
	"５"		: ["5"],
	"６"		: ["6"],
	"７"		: ["7"],
	"８"		: ["8"],
	"９"		: ["9"],
	"０"		: ["0"],
	"Ａ"		: ["A"],
	"Ｂ"		: ["B"],
	"Ｃ"		: ["C"],
	"Ｄ"		: ["D"],
	"Ｅ"		: ["E"],
	"Ｆ"		: ["F"],
	"Ｇ"		: ["G"],
	"Ｈ"		: ["H"],
	"Ｉ"		: ["I"],
	"Ｊ"		: ["J"],
	"Ｋ"		: ["K"],
	"Ｌ"		: ["L"],
	"Ｍ"		: ["M"],
	"Ｎ"		: ["N"],
	"Ｏ"		: ["O"],
	"Ｐ"		: ["P"],
	"Ｑ"		: ["Q"],
	"Ｒ"		: ["R"],
	"Ｓ"		: ["S"],
	"Ｔ"		: ["T"],
	"Ｕ"		: ["U"],
	"Ｖ"		: ["V"],
	"Ｗ"		: ["W"],
	"Ｘ"		: ["X"],
	"Ｙ"		: ["Y"],
	"Ｚ"		: ["Z"],
	"ア"		: ["A"],
	"イ"		: ["I"],
	"ウ"		: ["U", "WU"],
	"エ"		: ["E"],
	"オ"		: ["O"],
	"カ"		: ["KA", "CA"],
	"キ"		: ["KI"],
	"ク"		: ["KU", "CU", "QU"],
	"ケ"		: ["KE"],
	"コ"		: ["KO", "CO"],
	"サ"		: ["SA"],
	"シ"		: ["SI", "CI", "SHI"],
	"ス"		: ["SU"],
	"セ"		: ["SE", "CE"],
	"ソ"		: ["SO"],
	"タ"		: ["TA"],
	"チ"		: ["TI", "CHI"],
	"ツ"		: ["TU", "TSU"],
	"テ"		: ["TE"],
	"ト"		: ["TO"],
	"ナ"		: ["NA"],
	"ニ"		: ["NI"],
	"ヌ"		: ["NU"],
	"ネ"		: ["NE"],
	"ノ"		: ["NO"],
	"ハ"		: ["HA"],
	"ヒ"		: ["HI"],
	"フ"		: ["HU", "FU"],
	"ヘ"		: ["HE"],
	"ホ"		: ["HO"],
	"マ"		: ["MA"],
	"ミ"		: ["MI"],
	"ム"		: ["MU"],
	"メ"		: ["ME"],
	"モ"		: ["MO"],
	"ヤ"		: ["YA"],
	"ユ"		: ["YU"],
	"ヨ"		: ["YO"],
	"ラ"		: ["RA"],
	"リ"		: ["RI"],
	"ル"		: ["RU"],
	"レ"		: ["RE"],
	"ロ"		: ["RO"],
	"ワ"		: ["WA"],
	"ヲ"		: ["WO"],
//	"ン"		: ["NN"],
	"ガ"		: ["GA"],
	"ギ"		: ["GI"],
	"グ"		: ["GU"],
	"ゲ"		: ["GE"],
	"ゴ"		: ["GO"],
	"ザ"		: ["ZA"],
	"ジ"		: ["JI", "ZI"],
	"ズ"		: ["ZU"],
	"ゼ"		: ["ZE"],
	"ゾ"		: ["ZO"],
	"ダ"		: ["DA"],
	"ヂ"		: ["DI"],
	"ヅ"		: ["DU"],
	"デ"		: ["DE"],
	"ド"		: ["DO"],
	"バ"		: ["BA"],
	"ビ"		: ["BI"],
	"ブ"		: ["BU"],
	"ベ"		: ["BE"],
	"ボ"		: ["BO"],
	"パ"		: ["PA"],
	"ピ"		: ["PI"],
	"プ"		: ["PU"],
	"ペ"		: ["PE"],
	"ポ"		: ["PO"],
	"ァ"		: ["XA", "LA"],
	"ィ"		: ["XI", "XYI", "LI", "LYI"],
	"ゥ"		: ["XU", "LU"],
	"ェ"		: ["XE", "XYE", "LE", "LYE"],
	"ォ"		: ["XO", "LO"],
	"ャ"		: ["XYA", "LYA"],
	"ュ"		: ["XYU", "LYU"],
	"ョ"		: ["XYO", "LYO"],
	"ヶ"		: ["XKE", "LKE"],
//	"ッ"		: ["XTU", "LTU", "XTSU", "LTSU"],
	"ウィ"	: ["WI"],
	"ウェ"	: ["WE"],
	"キャ"	: ["KYA"],
	"キィ"	: ["KYI"],
	"キェ"	: ["KYE"],
	"キュ"	: ["KYU"],
	"キョ"	: ["KYO"],
	"クァ"	: ["QA", "KWA"],
	"クィ"	: ["QI", "QYI"],
	"クェ"	: ["QE"],
	"クォ"	: ["QO"],
	"クャ"	: ["QYA"],
	"クュ"	: ["QYU"],
	"クョ"	: ["QYO"],
	"シャ"	: ["SYA", "SHA"],
	"シィ"	: ["SYI"],
	"シュ"	: ["SYU", "SHU"],
	"シェ"	: ["SYE", "SHE"],
	"ショ"	: ["SYO", "SHO"],
	"チャ"	: ["TYA", "CHA", "CYA"],
	"チィ"	: ["TYI", "CYI"],
	"チュ"	: ["TYU", "CHU", "CYU"],
	"チェ"	: ["TYE", "CHE", "CYE"],
	"チョ"	: ["TYO", "CHO", "CYO"],
	"ツァ"	: ["TSA"],
	"ツィ"	: ["TSI"],
	"ツェ"	: ["TSE"],
	"ツォ"	: ["TSO"],
	"テャ"	: ["THA"],
	"ティ"	: ["THI"],
	"テュ"	: ["THU"],
	"テェ"	: ["THE"],
	"テョ"	: ["THO"],
	"トァ"	: ["TWA"],
	"トィ"	: ["TWI"],
	"トゥ"	: ["TWU"],
	"トェ"	: ["TWE"],
	"トォ"	: ["TWO"],
	"ニャ"	: ["NYA"],
	"ニィ"	: ["NYI"],
	"ニュ"	: ["NYU"],
	"ニェ"	: ["NYE"],
	"ニョ"	: ["NYO"],
	"ヒャ"	: ["HYA"],
	"ヒィ"	: ["HYI"],
	"ヒュ"	: ["HYU"],
	"ヒェ"	: ["HYE"],
	"ヒョ"	: ["HYO"],
	"ファ"	: ["FA"],
	"フィ"	: ["FI", "FYI"],
	"フェ"	: ["FE", "FYE"],
	"フォ"	: ["FO"],
	"フャ"	: ["FYA"],
	"フュ"	: ["FYU"],
	"フョ"	: ["FYO"],
	"ミャ"	: ["MYA"],
	"ミィ"	: ["MYI"],
	"ミュ"	: ["MYU"],
	"ミェ"	: ["MYE"],
	"ミョ"		: ["MYO"],
	"リャ"	: ["RYA"],
	"リィ"	: ["RYI"],
	"リュ"	: ["RYU"],
	"リェ"	: ["RYE"],
	"リョ"		: ["RYO"],
	"ギャ"	: ["GYA"],
	"ギィ"	: ["GYI"],
	"ギュ"	: ["GYU"],
	"ギェ"	: ["GYE"],
	"ギョ"	: ["GYO"],
	"ジャ"	: ["ZYA", "JA", "JYA"],
	"ジィ"	: ["ZYI", "JYI"],
	"ジュ"	: ["ZYU", "JU", "JYU"],
	"ジェ"	: ["ZYE", "JE", "JYE"],
	"ジョ"	: ["ZYO", "JO", "JYO"],
	"ヂャ"	: ["DYA"],
	"ヂィ"	: ["DYI"],
	"ヂュ"	: ["DYU"],
	"ヂェ"	: ["DYE"],
	"ヂョ"	: ["DYO"],
	"デャ"	: ["DHA"],
	"ディ"	: ["DHI"],
	"デュ"	: ["DHU"],
	"デェ"	: ["DHE"],
	"デョ"	: ["DHO"],
	"ドァ"	: ["DWA"],
	"ドィ"	: ["DWI"],
	"ドゥ"	: ["DWU"],
	"ドェ"	: ["DWE"],
	"ドォ"	: ["DWO"],
	"ビャ"	: ["BYA"],
	"ビィ"	: ["BYI"],
	"ビュ"	: ["BYU"],
	"ビェ"	: ["BYE"],
	"ビョ"	: ["BYO"],
	"ピャ"	: ["PYA"],
	"ピィ"	: ["PYI"],
	"ピュ"	: ["PYU"],
	"ピェ"	: ["PYE"],
	"ピョ"	: ["PYO"],
	"！"		: ["!"],
	"”"		: ["\""],
	"＃"		: ["#"],
	"％"		: ["%"],
	"＆"		: ["&"],
	"’"		: ["'"],
	"（"		: ["("],
	"）"		: [")"],
	"ー"		: ["-"],
	"＝"		: ["="],
	"＾"		: ["^"],
	"～"		: ["~"],
	"￥"		: ["\\"],
	"|"		: ["|"],
	"＠"		: ["@"],
	"‘"		: ["`"],
	"「"		: ["["],
	"｛"		: ["{"],
	"＋"		: ["+"],
	"＊"		: ["*"],
	"」"		: ["]"],
	"｝"		: ["}"],
	"、"		: [","],
	"＜"		: ["<"],
	"。"		: ["."],
	"＞"		: [">"],
	"・"		: ["/"],
	"？"		: ["?"],
	"￥"		: ["\\"],
	"＿"		: ["_"],
	"　"		: [" "]
}

Typing.datas = [
    {
        question: "初めに、神が天と地を創造した",
        kana: "ハジメニ、カミガテントチヲソウゾウシタ",
        comment: "創世記1:1"
    },
    {
        question: "人はその父と母を離れ、妻と結び合い、二人は一体となる",
        kana: "ヒトハソノチチトハハヲハナレ、ツマトムスビアイ、フタリハイッタイトナル",
        comment: "創世記2:24"
    },
    {
        question: "わたしは全能の神である。あなたはわたしの前を歩み、まったき者であれ",
        kana: "ワタシハゼンノウノカミデアル。アナタハワタシノマエヲアユミ、マッタキモノデアレ",
        comment: "創世記17:1"
    },
    {
        question: "あなたがたの中にある異国の神々を取り除き、身をきよめ、着物を着替えなさい",
        kana: "アナタガタノナカニアルイコクノカミガミヲトリノゾキ、ミヲキヨメ、キモノヲキガエナサイ",
        comment: "創世記35:2"
    },
    {
        question: "神のともしびはまだ消えていず、サムエルは神の箱の安置されている主の宮で寝ていた",
        kana: "カミノトモシビハマダキエテイズ、サムエルハカミノハコノアンチサレテイルシュノミヤデネテイタ",
        comment: "第一サムエル3:3"
    },
    {
        question: "あなたは幼子と乳飲み子たちの口によって、力を打ち建てられました",
        kana: "アナタハオサナゴトチノミゴタチノクチニヨッテ、チカラヲウチタテラレマシタ",
        comment: "詩篇8:2"
    },
    {
        question: "神、その道は完全。主のみことばは純粋。主はすべて彼に身を避ける者の盾",
        kana: "カミ、ソノミチハカンゼン。シュノミコトバハジュンスイ。シュハスベテカレニミヲサケルモノノタテ",
        comment: "詩篇23:1"
    },
    {
        question: "主は私の羊飼い。私は乏しいことがありません",
        kana: "シュハワタシノヒツジカイ。ワタシハトボシイコトガアリマセン",
        comment: "詩篇23:1"
    },
    {
        question: "あなたの道を主にゆだねよ。主に信頼せよ。主が成し遂げてくださる",
        kana: "アナタノミチヲシュニユダネヨ。シュニシンライセヨ。シュガナシトゲテクダサル",
        comment: "詩篇37:5"
    },
    {
        question: "主に感謝せよ。主はまことにいつくしみ深い。その恵みはとこしえまで",
        kana: "シュニカンシャセヨ。シュハマコトニイツクシミブカイ。ソノメグミハトコシエマデ",
        comment: "詩篇118"
    },
    {
        question: "あなたのみことばは私の足のともしび、私の道の光です",
        kana: "アナタノミコトバハワタシノアシノトモシビ、ワタシノミチノヒカリデス",
        comment: "詩篇118"
    },
    {
        question: "恐れるな。わたしはあなたとともにいる。たじろぐな。わたしがあなたの神だから",
        kana: "オソレルナ。ワタシハアナタトトモニイル。タジログナ。ワタシガアナタノカミダカラ",
        comment: "イザヤ41:10"
    },
    {
        question: "永遠の愛をもってわたしはあなたを愛した",
        kana: "エイエンノアイヲモッテワタシハアナタヲアイシタ",
        comment: "エレミヤ31:2"
    },
    {
        question: "天にまします我らの父よ。御名があがめられますように。御国が来ますように",
        kana: "テンニマシマスワレラノチチヨ。ミナガアガメラレマスヨウニ。ミクニガキマスヨウニ",
        comment: "主の祈り"
    },
    {
        question: "神の国と神の義をまず第一に求めなさい",
        kana: "カミノクニトカミノギヲマズダイイチニモトメナサイ",
        comment: "マタイ6:33"
    },
    {
        question: "求めなさい。そうすれば与えられます。捜しなさい。そうすれば見つかります。たたきなさい。そうすれば開かれます。",
        kana: "モトメナサイ。ソウスレバアタエラレマス。サガシナサイ。ソウスレバミツカリマス。タタキナサイ。ソウスレバヒラカレマス。",
        comment: "マタイ7:7"
    },
    {
        question: "この御国の福音は全世界に宣べ伝えられて、すべての国民にあかしされ、それから終わりの日が来ます",
        kana: "コノミクニノフクインハゼンセカイニノベツタエラレテ、スベテノコクミンニアカシサレ、ソレカラオワリノヒガキマス",
        comment: "マタイ24:14"
    },
    {
        question: "見よ。わたしは世の終わりまで、いつもあなたがたとともにいます",
        kana: "ミヨ。ワタシハヨノオワリマデ、イツモアナタガタトトモニイマス",
        comment: "マタイ28:20"
    },
    {
        question: "誰でもわたしについてきたいと思うなら、自分を捨て、自分の十字架を負って、わたしについてきなさい",
        kana: "ダレデモワタシニツイテキタイトオモウナラ、ジブンヲステ、ジブンノジュウジカヲオッテ、ワタシニツイテキナサイ",
        comment: "マルコ8:34"
    },
    {
        question: "わたしの家はすべての民の祈りの家と呼ばれる",
        kana: "ワタシノイエハスベテノタミノイノリノイエトヨバレル",
        comment: "マルコ11:17"
    },
    {
        question: "神にとって不可能なことは一つもありません",
        kana: "カミニトッテフカノウナコトハヒトツモアリマセン",
        comment: "ルカ1:37"
    },
    {
        question: "きょうダビデの町であなたがたのために救い主がお生まれになりました。この方こそ主キリストです",
        kana: "キョウダビデノマチデアナタガタノタメニスクイヌシガオウマレニナリマシタ。コノカタコソシュキリストデス",
        comment: "ルカ2:11"
    },
    {
        question: "いのちを与えるのは御霊です",
        kana: "イノチヲアタエルノハミタマデス",
        comment: "ヨハネ6:63"
    },
    {
        question: "わたしはぶどうの木で、あなたがたは枝です",
        kana: "ワタシハブドウノキデ、アナタガタハエダデス",
        comment: "ヨハネ15:5"
    },
    {
        question: "人がその友のためにいのちを捨てるという、これよりも大きな愛は誰ももっていません",
        kana: "ヒトガソノトモノタメニイノチヲステルトイウ、コレヨリモオオキナアイハダレモモッテイマセン",
        comment: "ヨハネ15:5"
    },
    {
        question: "主イエスの恵みが、あなたがたとともにありますように",
        kana: "シュイエスノメグミガ、アナタガタトトモニアリマスヨウニ",
        comment: "1コリント16:23"
    },
    {
        question: "私はキリストとともに十字架につけられました",
        kana: "ワタシハキリストトトモニジュウジカニツケラレマシタ",
        comment: "ガラテヤ2:20"
    },
    {
        question: "あなたがたが神のみこころをおこなって約束のものを手に入れるために必要なのは忍耐です",
        kana: "アナタガタガカミノミココロヲオコナッテヤクソクノモノヲテニイレルタメニヒツヨウナノハニンタイデス",
        comment: "ヘブル10:35"
    },
    {
        question: "ハレルヤ。万物の支配者である、われらの神は王となられた",
        kana: "ハレルヤ。バンブツノシハイシャデアル、ワレラノカミハオウトナラレタ",
        comment: "黙示録19:6"
    }
];
