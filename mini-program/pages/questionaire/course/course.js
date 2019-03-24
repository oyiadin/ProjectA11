var _ = require('../../i18n.js')._;


Page({
    data:{
        radioItems:[
            { name: '很满意', value: '0'},
            { name: '满意', value: '1'},
            { name: '不满意', value: '2'}
        ],
        checkboxItems:[
            { name: '使用粉笔黑板的传统授课方式', value: '0'},
            { name: '使用电脑ppt的授课方式', value: '1'},
            {name: '在多媒体教室进行小组讨论的授课方式', value: '2'}
        ]
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
          radioItems: radioItems
        });
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if(checkboxItems[i].value == values[j]){
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
    }
});