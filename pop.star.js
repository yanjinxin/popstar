

var Stars = function (wrapperId) {

    //星星坐标容器
    this._starsPointZoom = null;
    //星星坐标实体
    this._starsPoint = { x: 0, y: 0, index: 0, key: "", isNull: 0, row: 0, column: 0, starid: "" };
    //星星容器
    this._starsZoom = null;
    //星星
    this._star = { width: 30, height: 32, diff: 2, starid: "", key: "" };
    //星星颜色数组
    this._starColorAry = ["red", "yellow", "blue", "green", "purple"];
	
    //容器id
    this._wrapperId = wrapperId;
	
    //临时星星容器
    this._tempStarsArray = null;
    //星星的样式
    this._starClass = "box";
    //本次是否清完
    this._isLocalClear = true;
    //总成绩
    this._sumScore = 0;
    //当前关数
    this._level = 1;
    //分数显示面板id
    this._scorePanelId = "";    
}

Stars.prototype = {

    init: function () {

        //初始化星星容器
        this.initStarsPointZoom();
        //初始化星星
        this.initStarsZoom();
        //填充星星
        this.fillStarsData();

    },

    initStarsPointZoom: function () {

        var that = this;

        that._starsPointZoom = new Array();

        var tempStar = { x: 0, y: 0, index: 0, key: "", isNull: 0, row: 0, column: 0, starid: "" };

        var point = that._star;

        for (var i = 0; i < 10; i++) {

            for (var j = 0; j < 10; j++) {

                tempStar.x = j * point.width + (j + 1) * point.diff;
                tempStar.y = i * point.height + (i + 1) * point.diff;
                tempStar.row = i;
                tempStar.column = j;
                tempStar.index = i * 10 + j;
                //添加
                that._starsPointZoom.push(that.getStarsPoint(tempStar));
            }
        }

    },

    initStarsZoom: function () {

        var that = this;

        that._starsZoom = new Array();

        //初始化分数界面
        $("#game_level").html("关卡：" + that._level);
        $("#aim_score").html("目标：" + that.countScore("level_score"));
    },

    setScore: function (score) {
		
        var that = this;

        var tempScore = that._sumScore + score;

        //that._sumScore = that._sumScore + score;
		
        //$("#game_score").html("分数：" + that._sumScore);

        var scoreTimer = setInterval(function () {

            $("#game_score").html("分数：" + that._sumScore);

            if (that._sumScore >= tempScore) {
	            $("#game_score").html("分数：" + tempScore);
                clearInterval(scoreTimer);
            }

            that._sumScore+=10;
        }, 1);

    },

    countScore: function (scoreType) {

        var that = this;

        var score = 0;
		
		var count = 0;
		
        if (scoreType == "end_score") {

            count = 0;

            for (var i = 0; i < that._starsPointZoom.length; i++) {

                if (that._starsPointZoom[i].isNull == 1) {
                    count++;
                }
            }

            switch (count) {
                case 10: score = 0; break;
                case 9: score = 380; break;
                case 8: score = 720; break;
                case 7: score = 1020; break;
                case 6: score = 1280; break;
                case 5: score = 1500; break;
                case 4: score = 1680; break;
                case 3: score = 1820; break;
                case 2: score = 1920; break;
                case 1: score = 1980; break;
                case 0: score = 2000; break;
                default: score = 0; break;
            }
            
			$("#"+that._scorePanelId).html("");
        }
        else if (scoreType == "level_score") {

            switch (that._level) {

                case 1: score = 1000; break;
                case 2: score = 2500; break;
                case 3: score = 4500; break;

                default: score = 4500 + 2000 * (that._level - 3) + (that._level - 2) * 20; break;
            }
        }
        else if (scoreType == "inside_score") {

            var count = that._tempStarsArray.length;

            if (count > 1) {
                score = count * count * 5;
            }
            
            if(count >= 4 && count <= 5)
            {
	            document.getElementById("mp3_pop").play();
            }
            
            if(count > 5)
            {
	            document.getElementById("mp3_pop2").play();
            }
                        
            //显示分数
			$("#"+that._scorePanelId).html(count + "连消 " + score + " 分");
       
        }		
		
        return score;
    },

    fillStarsData: function () {

        var that = this;

        for (var j = 0; j < that._starColorAry.length; j++) {

            for (var i = 0; i < 20; i++) {

                that.getRandomStar(j);
            }
        }

        setTimeout(function () {

            var touch = ('ontouchstart' in window);
            var START_EVENT = touch ? 'touchstart' : 'mousedown';
            var MOVE_EVENT = touch ? 'touchmove' : 'mousemove';
            var END_EVENT = touch ? 'touchend' : 'mouseup';
            //星星点击事件
            $("." + that._starClass).bind(END_EVENT, function () {

                if (that._isLocalClear) {

                    var id = $(this).attr("id");

                    that._tempStarsArray = new Array();

                    that.joinBox(id);

                    that.clearStars();

                }

            });

        }, 300);
    },

    getStarsPoint: function (starsPoint) {

        return { x: starsPoint.x, y: starsPoint.y, index: starsPoint.index, key: starsPoint.key, isNull: starsPoint.isNull, row: starsPoint.row, column: starsPoint.column, starid: starsPoint.starid };
    },

    remove: function (id) {

        var that = this;

        $("#" + id).css("display", "none");

        $("#" + id).remove();
    },

    //消灭星星
    clearStars: function () {

        var that = this;

        if (that._tempStarsArray.length > 1) {

            var k = 0;

            setTimeout(function () {

                if (that._tempStarsArray.length > 4) {
                    //document.getElementById("mp3_pop").play();
                }

            }, 100);

            //设置消除状态
            that._isLocalClear = false;

            //显示分数
            that.setScore(that.countScore("inside_score"));

            var tempTimer = setInterval(function () {

                var point = that._tempStarsArray[k];

                that.remove(point.starid);

                if (k == that._tempStarsArray.length - 1) {

                    for (var i = 0; i < that._tempStarsArray.length; i++) {

                        var t_Point = that._tempStarsArray[i];

                        for (var j = 0; j < that._starsPointZoom.length; j++) {

                            var pt = that._starsPointZoom[j];

                            if (t_Point.starid == pt.starid) {
                                pt.isNull = 0;
                                pt.key = "";
                                pt.starid = "";
                            }
                        }
                    }

                    //向下移动
                    that.move();

                    //向左移动
                    setTimeout(function () {
                        that.moveToLeft();
						
                    }, 300);                    

                    clearInterval(tempTimer);
                }

                k++;

            }, 50);

        }

    },

    add: function (name, key, index) {

        var that = this;

        var div = $("<div>");

        var id = name + that._starsZoom.length;
        div.attr("id", id);

        that._starsZoom.push(id);

        div.attr("class", key + "_box " + that._starClass);

        $("#" + that._wrapperId).append(div);

        that._starsPointZoom[index].isNull = 1;
        that._starsPointZoom[index].key = key;
        that._starsPointZoom[index].starid = id;

        that.setPosition(id, that._starsPointZoom[index].x, that._starsPointZoom[index].y);
    },

    setPosition: function (id, x, y) {

        $("#" + id).css("transform", "translate3d(" + x + "px," + y + "px,0px)");
        $("#" + id).css("-webkit-transform", "translate3d(" + x + "px," + y + "px,0px)");
        $("#" + id).css("-o-transform", "translate3d(" + x + "px," + y + "px,0px)");
    },

    move: function () {

        var that = this;

        //存储位置的临时数组
        var tempBoxArray = new Array();

        //存储星星的临时数组
        var tempStarArray = new Array();

        for (var i = 0; i < 10; i++) {

            tempBoxArray.push(new Array());

            tempStarArray.push(new Array());
        }

        for (var i = 0; i < that._starsPointZoom.length; i++) {

            var point = that.getStarsPoint(that._starsPointZoom[i]);

            if (point.isNull == 1) {

                tempStarArray[point.column].push(point);
            }

            for (var j = 0; j < that._starsPointZoom.length; j++) {

                var point2 = that.getStarsPoint(that._starsPointZoom[j]);

                if (point.isNull == 1) {

                    if (point.column == point2.column) {

                        that.add_array(tempBoxArray[point.column], point2, "index");
                    }
                }
            }
        }

        //开始移动
        for (var im = 0; im < tempStarArray.length; im++) {

            var ik = 0;

            for (var i = tempStarArray[im].length - 1; i >= 0; i--) {

                var jk = 0;

                for (var j = tempBoxArray[im].length - 1; j >= 0; j--) {

                    if (ik == jk) {

                        //循环位置链表
                        for (var k = 0; k < that._starsPointZoom.length; k++) {

                            //移除数字原来的位置
                            if (that._starsPointZoom[k].index == tempStarArray[im][i].index) {
                                that._starsPointZoom[k].isNull = 0;
                                that._starsPointZoom[k].key = "";
                                that._starsPointZoom[k].starid = "";
                            }

                            //添加到现在的位置
                            if (that._starsPointZoom[k].index == tempBoxArray[im][j].index) {
                                that._starsPointZoom[k].isNull = 1;
                                that._starsPointZoom[k].key = tempStarArray[im][i].key;
                                that._starsPointZoom[k].starid = tempStarArray[im][i].starid;

                                var id = that._starsPointZoom[k].starid;

                                that.setPosition(id, that._starsPointZoom[k].x, that._starsPointZoom[k].y);

                            }

                        }
                    }

                    jk++;
                }

                ik++;
            }

        } //最外层循环结束

    },

    //向左合并
    moveToLeft: function () {

        var that = this;

        //存储星星的临时数组
        var tempStarArray = new Array();

        for (var i = 0; i < 10; i++) {

            tempStarArray.push(new Array());
        }

        for (var i = 0; i < that._starsPointZoom.length; i++) {

            var point = that._starsPointZoom[i];

            if (point.isNull == 1) {

                tempStarArray[point.column].push(point);
            }
        }

        var k = 0;

        for (var i = 0; i < tempStarArray.length; i++) {

            if (tempStarArray[i].length == 0) {

                var count = 0;

                for (var j = i; j < tempStarArray.length; j++) {

                    if (tempStarArray[j].length > 0) {

                        var diff = i - j + count;

                        //移动一列的位置
                        for (var k = 0; k < tempStarArray[j].length; k++) {

                            var point = tempStarArray[j][k];

                            //移除现在的位置
                            var currentIndex = point.index;
                            //中间值存储
                            var tempKey = point.key;
                            var tempStarid = point.starid;
                            //移除现在的位置
                            point.isNull = 0;
                            point.key = "";
                            point.starid = "";
                            //添加到新的位置
                            var afterIndex = currentIndex + diff;
                            that._starsPointZoom[afterIndex].isNull = 1;
                            that._starsPointZoom[afterIndex].key = tempKey;
                            that._starsPointZoom[afterIndex].starid = tempStarid;
                            //移动
                            that.setPosition(tempStarid, that._starsPointZoom[afterIndex].x, that._starsPointZoom[afterIndex].y);
                        }

                        count++;
                    }
                }

                break;
            }

        }

        //完成本次清除
        that._isLocalClear = true;

        //判断是否还有相邻的
        that.isHasPopStar();
    },

    joinBox: function (boxId) {

        var that = this;

        var boxPoint = null;

        //通过boxId找到其位置
        for (var i = 0; i < that._starsPointZoom.length; i++) {

            boxPoint = that._starsPointZoom[i];

            if (boxPoint.starid == boxId) {

                that.add_array(that._tempStarsArray, that.getStarsPoint(boxPoint), "starid");
                break;
            }
        }

        //查找当前box上，下，左，右四个方向，是否有key值一样的星星

        //如果有，进入递归调用
        var upPoint = null, rightPoint = null, downPoint = null, leftPoint = null;
		
        //上
        upPoint = that.getStarByDir("up", boxPoint);

        if (upPoint != null) {

            that.joinBox(upPoint.starid);
        }

        //右
        rightPoint = that.getStarByDir("right", boxPoint);

        if (rightPoint != null) {

            that.joinBox(rightPoint.starid);
        }

        //下
        downPoint = that.getStarByDir("down", boxPoint);

        if (downPoint != null) {

            that.joinBox(downPoint.starid);
        }

        //左
        leftPoint = that.getStarByDir("left", boxPoint);

        if (leftPoint != null) {

            that.joinBox(leftPoint.starid);
        }

        //如果没有，跳出递归
        if (upPoint == null && rightPoint == null && downPoint == null && leftPoint == null) {

            return;
        }
    },

    //不能添加重复
    add_array: function (ary, ele, param) {

        var isHas = false;

        for (var k = 0; k < ary.length; k++) {

            if (ary[k][param] == ele[param]) {

                isHas = true;
            }
        }

        if (!isHas) {
            ary.push(ele);
        }
    },

    //根据方向获取星星
    getStarByDir: function (dir, starPoint) {

        var that = this;

        //生成二维数组
        var tempBoxArray = new Array();

        for (var j = 0; j < 10; j++) {

            tempBoxArray.push(new Array());

            for (var i = 0; i < that._starsPointZoom.length; i++) {

                var point = that._starsPointZoom[i];

                if (point.row == j) {
                    tempBoxArray[j].push(point);
                }
            }
        }

        var boxPoint = null;

        if (dir == "up") {

            if (starPoint.row == 0) {
                return null;
            }
            else {
                boxPoint = tempBoxArray[starPoint.row - 1][starPoint.column];
            }
        }
        else if (dir == "right") {

            if (starPoint.column == 9) {
                return null;
            }
            else {
                boxPoint = tempBoxArray[starPoint.row][starPoint.column + 1];
            }
        }
        else if (dir == "down") {

            if (starPoint.row == 9) {
                return null;
            }
            else {
                boxPoint = tempBoxArray[starPoint.row + 1][starPoint.column];
            }
        }
        else if (dir == "left") {

            if (starPoint.column == 0) {
                return null;
            }
            else {
                boxPoint = tempBoxArray[starPoint.row][starPoint.column - 1];
            }
        }

        if (boxPoint.key != starPoint.key) {
            return null;
        }

        //判断获取到的星星是否是原来已有的星星
        //如果有，返回null
        var isHas = false;
        for (var i = 0; i < that._tempStarsArray.length; i++) {

            if (boxPoint.starid == that._tempStarsArray[i].starid) {

                isHas = true;
                break;
            }
        }

        if (isHas) {
            return null;
        }
        else {
            return boxPoint;
        }
    },

    isHasPopStar: function () {

        var that = this;

        var tempAry = new Array();

        for (var i = 0; i < that._starsPointZoom.length; i++) {

            var point = that._starsPointZoom[i];

            if (point.isNull == 1) {
                tempAry.push(point);
            }
        }

        var isHas = false;

        for (var i = 0; i < tempAry.length; i++) {

            var point = tempAry[i];

            //查找当前box上，下，左，右四个方向，是否有key值一样的星星

            //如果有，进入递归调用
            var upPoint = null, rightPoint = null, downPoint = null, leftPoint = null;

            //上
            upPoint = that.getStarByDir("up", point);

            //右
            rightPoint = that.getStarByDir("right", point);

            //下
            downPoint = that.getStarByDir("down", point);

            //左
            leftPoint = that.getStarByDir("left", point);

            //如果没有，跳出递归
            if (upPoint != null || rightPoint != null || downPoint != null || leftPoint != null) {

                isHas = true;
                break;
            }
        }

        if (!isHas) {

            alert("剩下" + tempAry.length + "颗星星，奖励" + that.countScore("end_score") + "分");

            //计算剩余的星星个数，计算分数
            that.setScore(that.countScore("end_score"));

            for (var i = 0; i < tempAry.length; i++) {

                $("#" + tempAry[i].starid).remove();
            }

            $("#" + that._wrapperId).html();

            if (that._sumScore > that.countScore("level_score")) {

                that.setNextLevel();
            }
            else {
                alert("很遗憾您没有过关！");
            }
        }
    },

    setNextLevel: function () {

        var that = this;

        that._level += 1;

        //初始化分数界面        
        that.init();
    },

    getRandomStar: function (index) {

        var that = this;

        var tempAry = new Array();

        for (var i = 0; i < that._starsPointZoom.length; i++) {

            var point = that._starsPointZoom[i];

            if (point.isNull == 0) {
                tempAry.push(point);
            }
        }

        var index_pos = that.getRandomNum(0, tempAry.length - 1);

        index_pos = tempAry[index_pos].index;

        var numAry = that._starColorAry;

        //var index = that.getRandomNum(0, numAry.length - 1);

        that.add(numAry[index], numAry[index], index_pos);
    },

    getRandomNum: function (min, max) {

        var Range = max - min;
        var Rand = Math.random();
        return (min + Math.round(Rand * Range));
    }
};