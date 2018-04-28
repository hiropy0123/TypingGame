import { CharTable } from './js/CharTable';
import { CodeTable } from './js/CodeTable';
import { BibleData } from './js/BibleData';
import jQuery from 'jquery';

import './style.css';

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
  if(Typing.second <= 10)
  {
    Typing.timerArea.css({
      'color' : '#ff0000'
    });
  } else {
	Typing.timerArea.css({
		'color' : '#353535'
	  });
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


// Load Keycode
Typing.codeTable = {};
for ( let code of CodeTable ) {
	Typing.codeTable[ code.keyCode ] = code.keyLabel;
}

// Load Charactor
Typing.charTable = {};
for ( let ct of CharTable ) {
	Typing.charTable[ ct.char ] = ct.typekey;
}

// Load Typing Data
Typing.datas = BibleData;

