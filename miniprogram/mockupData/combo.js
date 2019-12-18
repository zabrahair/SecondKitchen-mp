const combo =
{
  id: 'combo-1',
  name: '小云超值无敌套餐',
  price: 25.00,
  dishs: [
    {
      id: '1',
      name: "主食",
      price: 1.00,
      options: [
        {
          id: '1-1', name: '米饭', price: 1.00, isSelect: true,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '1-2', name: '炒面', price: 1.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '1-3', name: '汤面', price: 2.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '1-4', name: '年糕', price: 2.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
      ]
    },
    {
      id: '2',
      name: "大荤",
      price: 10.00,
      options: [
        {
          id: '2-1', name: '红烧肉', price: 10.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '2-2', name: '酱鸭腿', price: 10.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '2-3', name: '大排骨', price: 10.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '2-4', name: '咖喱鸡', price: 10.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
      ]
    },
    {
      id: '3',
      name: "小荤",
      price: 7.00,
      options: [
        {
          id: '3-1', name: '回锅肉片', price: 5.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '3-2', name: '番茄炒蛋', price: 5.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '3-3', name: '肉丝炒韭芽', price: 5.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
      ]
    },
    {
      id: '4',
      name: '素菜',
      price: 5.00,
      options: [
        {
          id: '4-1', name: '上汤娃娃菜', price: 3.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '4-2', name: '干煸草头', price: 4.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '4-3', name: '土豆烧刀豆', price: 4.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '4-4', name: '蚝油生菜', price: 3.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
      ]
    },
    {
      id: '5',
      name: '汤类',
      price: 2.00,
      options: [
        {
          id: '5-1', name: '肉丝蛋汤', price: 2.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '5-2', name: '紫菜开洋汤', price: 2.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '5-3', name: '番茄蛋汤', price: 2.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
        {
          id: '5-4', name: '榨菜蛋汤', price: 2.00, isSelect: false,
          image_url: 'https://ali.xinshipu.cn/20160621_1/original/1466440795346.jpg@288w_216h_99q_1e_1c.jpg'
            },
      ]
    }
  ]
}

module.exports = {
  combo: combo
}