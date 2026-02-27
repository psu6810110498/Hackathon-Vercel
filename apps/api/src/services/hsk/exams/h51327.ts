import { IHskExam } from "../types";

/**
 * HSK 5 Exam H51327 Digitized Data
 * Source: Official HSK Mock Paper
 */
export const H51327: IHskExam = {
  id: "H51327",
  level: 5,
  totalTime: 125,
  audioUrl: "/audio/hsk5/H51327.mp3",
  sections: [
    {
      id: "listening",
      title: "听力 (Listening)",
      instructions: "第一部分: 第 1-20 题: 请选出正确答案。\n第二部分: 第 21-45 题: 请选出正确答案。",
      questions: [
        // Part 1: 1-20
        { id: 1, type: "multiple-choice", options: ["太忙", "要出差", "不感兴趣", "准备不充分"], correctIndex: 0 },
        { id: 2, type: "multiple-choice", options: ["周末加班", "同意去钓鱼", "对海鲜过敏", "不想去郊外"], correctIndex: 1 },
        { id: 3, type: "multiple-choice", options: ["字数多", "结构太乱", "再检查一下", "有语法问题"], correctIndex: 2 },
        { id: 4, type: "multiple-choice", options: ["是演员", "学过跳舞", "第一次表演", "要教男的跳舞"], correctIndex: 1 },
        { id: 5, type: "multiple-choice", options: ["受伤了", "晕倒了", "腿流血了", "刚做完手术"], correctIndex: 0 },
        { id: 6, type: "multiple-choice", options: ["联系同学", "做通讯录", "换手机号", "改聚会地点"], correctIndex: 1 },
        { id: 7, type: "multiple-choice", options: ["简单易行", "帮助不大", "很有价值", "理论性太强"], correctIndex: 1 },
        { id: 8, type: "multiple-choice", options: ["角度偏", "缺乏新意", "研究范围大", "没有研究意义"], correctIndex: 2 },
        { id: 9, type: "multiple-choice", options: ["太薄了", "颜色艳", "质量差", "样子一般"], correctIndex: 1 },
        { id: 10, type: "multiple-choice", options: ["迷路了", "认错人了", "碰到了邻居", "没见过那个女孩儿"], correctIndex: 2 },
        { id: 11, type: "multiple-choice", options: ["卧室", "客厅", "阳台", "书房"], correctIndex: 0 },
        { id: 12, type: "multiple-choice", options: ["刚吃过", "餐厅太远", "胃不舒服", "不爱吃辣椒"], correctIndex: 2 },
        { id: 13, type: "multiple-choice", options: ["表示歉意", "通知她去上班", "让她来取简历", "告诉她考试成绩"], correctIndex: 1 },
        { id: 14, type: "multiple-choice", options: ["想考研", "想买书", "复习完了", "做事没目标"], correctIndex: 0 },
        { id: 15, type: "multiple-choice", options: ["没字幕", "没中文配音", "画面不清楚", "字幕和声音不一致"], correctIndex: 3 },
        { id: 16, type: "multiple-choice", options: ["收费不合理", "不打算安装了", "男的弄错时间了", "男的服务态度不好"], correctIndex: 2 },
        { id: 17, type: "multiple-choice", options: ["朋友推荐的", "报社要求的", "书的销量好", "为采访做准备"], correctIndex: 3 },
        { id: 18, type: "multiple-choice", options: ["广告宣传", "注册手续", "营业执照", "招聘方案"], correctIndex: 1 },
        { id: 19, type: "multiple-choice", options: ["要下雪", "资金不够", "路面结冰了", "参与的人少"], correctIndex: 0 },
        { id: 20, type: "multiple-choice", options: ["别灰心", "要加强锻炼", "女的进决赛了", "女的状态很好"], correctIndex: 3 },
        // Part 2: 21-45
        { id: 21, type: "multiple-choice", options: ["减肥", "退课", "学网球", "换教练"], correctIndex: 2 },
        { id: 22, type: "multiple-choice", options: ["钟歪了", "表停了", "椅子脏了", "柜子坏了"], correctIndex: 0 },
        { id: 23, type: "multiple-choice", options: ["订机票", "翻译资料", "做会议记录", "去机场接人"], correctIndex: 0 },
        { id: 24, type: "multiple-choice", options: ["没年假", "没去过云南", "没朋友做伴", "不能一起去"], correctIndex: 3 },
        { id: 25, type: "multiple-choice", options: ["还没批", "利润很高", "需要贷款", "被否定了"], correctIndex: 0 },
        { id: 26, type: "multiple-choice", options: ["皮鞋小了", "裤子太大", "裤子太短", "裙子太肥"], correctIndex: 1 },
        { id: 27, type: "multiple-choice", options: ["降雨量", "电视节目", "彩虹形状", "彩虹颜色"], correctIndex: 3 },
        { id: 28, type: "multiple-choice", options: ["找人代收", "来前台取", "现在来取", "取消订单"], correctIndex: 0 },
        { id: 29, type: "multiple-choice", options: ["房子面积小", "他们想租房", "他们签合同了", "那儿购物方便"], correctIndex: 1 },
        { id: 30, type: "multiple-choice", options: ["照片", "杂志", "日记", "明信片"], correctIndex: 0 },
        { id: 31, type: "multiple-choice", options: ["有亲戚来", "财主过生日", "财主请人吃饭", "邻居租他家房子请客"], correctIndex: 3 },
        { id: 32, type: "multiple-choice", options: ["小气", "大方", "狡猾", "热心"], correctIndex: 0 },
        { id: 33, type: "multiple-choice", options: ["针", "刀", "筷子", "玩具"], correctIndex: 0 },
        { id: 34, type: "multiple-choice", options: ["乐于助人", "懂得照顾人", "从小勤奋好学", "刚开始读书没耐心"], correctIndex: 3 },
        { id: 35, type: "multiple-choice", options: ["要尊敬老人", "实践出真知", "要有怀疑精神", "坚持不懈才能成功"], correctIndex: 3 },
        { id: 36, type: "multiple-choice", options: ["画儿不见了", "画家要价高", "画家说谎了", "画家画得很快"], correctIndex: 1 },
        { id: 37, type: "multiple-choice", options: ["很多动物", "一只孔雀", "别人订的画儿", "一堆画着孔雀的废纸"], correctIndex: 3 },
        { id: 38, type: "multiple-choice", options: ["把画儿撕了", "准备了一年", "没卖那幅画儿", "不想跟富翁做生意"], correctIndex: 1 },
        { id: 39, type: "multiple-choice", options: ["爱吃鱼", "不见客", "不想做官", "不收别人送的鱼"], correctIndex: 3 },
        { id: 40, type: "multiple-choice", options: ["答谢他", "求他办事", "知道 he 养鱼", "他做的鱼味道好"], correctIndex: 1 },
        { id: 41, type: "multiple-choice", options: ["眼见为实", "做人要谦虚", "要相信别人", "不要占小便宜"], correctIndex: 3 },
        { id: 42, type: "multiple-choice", options: ["制定计划", "特意提醒自己", "找人一起运动", "加大锻炼强度"], correctIndex: 1 },
        { id: 43, type: "multiple-choice", options: ["第 21 天最关键", "坏习惯很难改掉", "越熟悉的越容易忘记", "养成新习惯至少要 21 天"], correctIndex: 3 },
        { id: 44, type: "multiple-choice", options: ["把鞋扔进果园", "脱了衣服爬进去", "找到最矮的围墙", "借助旁边的大树"], correctIndex: 0 },
        { id: 45, type: "multiple-choice", options: ["要独立", "要客观评价自己", "切断后路才能激发潜力", "成长过程中免不了做错事"], correctIndex: 2 }
      ]
    },
    {
      id: "reading",
      title: "阅读 (Reading)",
      instructions: "第一部分: 第 46-60 题: 请选出正确答案。\n第二部分: 第 61-70 题: 请选出与试题内容一致的一项。\n第三部分: 第 71-90 题: 请选出正确答案。",
      questions: [
        // 46-60
        { id: 46, type: "multiple-choice", options: ["缓解", "消失", "消灭", "降低"], correctIndex: 0 },
        { id: 47, type: "multiple-choice", options: ["真实", "原来", "正确", "合法"], correctIndex: 2 },
        { id: 48, type: "multiple-choice", options: ["情绪", "语气", "观点", "表情"], correctIndex: 0 },
        { id: 49, type: "multiple-choice", options: ["例如", "不如", "好像", "据说"], correctIndex: 2 },
        { id: 50, type: "multiple-choice", options: ["彻底", "反复", "陆续", "绝对"], correctIndex: 0 },
        { id: 51, type: "multiple-choice", options: ["明天也许会更好", "过去的就让它过去吧", "失败未必是成功之母", "失败并不是最终的定论"], correctIndex: 3 },
        { id: 52, type: "multiple-choice", options: ["感想", "勇气", "风格", "行为"], correctIndex: 1 },
        { id: 53, type: "multiple-choice", options: ["凡是", "根本", "格外", "总算"], correctIndex: 1 },
        { id: 54, type: "multiple-choice", options: ["对于", "通过", "自从", "按照"], correctIndex: 3 },
        { id: 55, type: "multiple-choice", options: ["形象", "位置", "号码", "形势"], correctIndex: 2 },
        { id: 56, type: "multiple-choice", options: ["会使比赛更精彩", "比赛规则不能改变", "就很容易引起误会", "就会打扰观众看比赛"], correctIndex: 2 },
        { id: 57, type: "multiple-choice", options: ["陪伴", "协调", "组织", "执行"], correctIndex: 0 },
        { id: 58, type: "multiple-choice", options: ["贵族很得意", "国王没有表态", "国王连连点头", "大家哈哈大笑"], correctIndex: 1 },
        { id: 59, type: "multiple-choice", options: ["直接", "正式", "紧急", "明显"], correctIndex: 0 },
        { id: 60, type: "multiple-choice", options: ["命令", "答应", "欣赏", "称赞"], correctIndex: 3 },
        // 61-70
        { id: 61, type: "multiple-choice", options: ["围棋规则复杂", "围棋适合 4 人玩儿", "围棋有 1000 多年的历史", "围棋的影响范围正逐步扩大"], correctIndex: 3 },
        { id: 62, type: "multiple-choice", options: ["有氧运动强度大", "有氧运动效果不佳", "有氧运动有益身心健康", "有氧运动宜在傍晚进行"], correctIndex: 2 },
        { id: 63, type: "multiple-choice", options: ["开玩笑要注意场合", "幽默感可以慢慢培养", "幽默的人懂得活跃气氛", "不要随便打断别人的谈话"], correctIndex: 2 },
        { id: 64, type: "multiple-choice", options: ["选择性失忆是常见病", "选择性失忆对大脑伤害极大", "选择性失忆目前还无法治疗", "选择性失忆病人会忘记不想记住的事"], correctIndex: 3 },
        { id: 65, type: "multiple-choice", options: ["错误是可以避免的", "成功离不开错误的经验", "年轻人普遍缺乏判断力", "智慧可以通过学习来获得"], correctIndex: 1 },
        { id: 66, type: "multiple-choice", options: ["山东的代称来自于古代国名", "文化同化是民族融合的基础", "齐鲁民族融合始于战国初年", "地域概念的形成促进了经济的发展"], correctIndex: 0 },
        { id: 67, type: "multiple-choice", options: ["海参比较怕冷", "海洋动物大多会夏眠", "夏眠是动物对环境的适应", "夏眠有利于动物保持体温恒定"], correctIndex: 2 },
        { id: 68, type: "multiple-choice", options: ["李煜后期的创作成就更大", "政治失败的皇帝更擅长作诗", "李煜前期的词充满了悲痛之情", "描写宫廷生活的词更受人们喜爱"], correctIndex: 0 },
        { id: 69, type: "multiple-choice", options: ["智商低的人容易发脾气", "愤怒时不要轻易做决定", "人在不生气时都很理智", "做决定前应多和别人商量"], correctIndex: 1 },
        { id: 70, type: "multiple-choice", options: ["企业应加强对员工的培训", "管理者应重视员工的意见", "团队建设对企业管理很重要", "企业发展需要良好的文化氛围"], correctIndex: 2 },
        // 71-90
        { id: 71, type: "multiple-choice", options: ["生病了", "觉得疲劳", "非常严肃", "情绪低落"], correctIndex: 3 },
        { id: 72, type: "multiple-choice", options: ["换条船", "织一张大网", "早点儿出海", "把网织得结实点儿"], correctIndex: 1 },
        { id: 73, type: "multiple-choice", options: ["船漏水了", "渔网破了", "渔夫没捕到鱼", "渔夫遇到了风暴"], correctIndex: 2 },
        { id: 74, type: "multiple-choice", options: ["要敢于尝试", "人要懂得满足", "细节决定成败", "不要过于追求完美"], correctIndex: 1 },
        { id: 75, type: "multiple-choice", options: ["没有奖品", "讨厌打架", "担心被老鼠打败", "不屑与老鼠比武"], correctIndex: 3 },
        { id: 76, type: "multiple-choice", options: ["浪费时间", "丢掉权力", "使自己变笨", "提高对方的能力"], correctIndex: 0 },
        { id: 77, type: "multiple-choice", options: ["最聪明的人", "遇事冷静的人", "勇于挑战强者的人", "善于抓住机会的人"], correctIndex: 0 },
        { id: 78, type: "multiple-choice", options: ["老鼠很胆小", "狮子更愿意和猫比赛", "要集中精力做重要的事", "同一层次的人交流更顺畅"], correctIndex: 2 },
        { id: 79, type: "multiple-choice", options: ["看到河水干了", "发现行李不见了", "被打的人掉进了河里", "有一个人找到了食物"], correctIndex: 2 },
        { id: 80, type: "multiple-choice", options: ["附近没有沙子", "希望同伴原谅他", "要记住朋友的帮助", "作为寻找方向的记号"], correctIndex: 2 },
        { id: 81, type: "multiple-choice", options: ["对朋友要求过高", "对朋友关心太少", "很少和家人沟通", "把爱情看得比友情更重"], correctIndex: 0 },
        { id: 82, type: "multiple-choice", options: ["付出与回报", "朋友的相处之道", "怎样表达感激之情", "如何让你的旅行更安全"], correctIndex: 1 },
        { id: 83, type: "multiple-choice", options: ["再买一瓶", "把空瓶卖掉", "把瓶子借给别人", "向别人借一个空瓶"], correctIndex: 3 },
        { id: 84, type: "multiple-choice", options: ["可以扔掉", "污染环境", "往往被忽视", "会占用空间"], correctIndex: 2 },
        { id: 85, type: "multiple-choice", options: ["能力不足", "不愿意交换", "汽水卖光了", "没有合理利用资源"], correctIndex: 3 },
        { id: 86, type: "multiple-choice", options: ["6 块钱的用处", "被遗忘的汽水", "你喝过那瓶汽水吗", "别浪费你的“空瓶”"], correctIndex: 3 },
        { id: 87, type: "multiple-choice", options: ["指出硬盘需要修复", "提示硬盘有可用空间", "告诉你别用这个硬盘", "提醒用户硬盘有病毒"], correctIndex: 1 },
        { id: 88, type: "multiple-choice", options: ["更新数据", "恢复电脑出厂设置", "恢复被删除的文件", "对数据进行分类处理"], correctIndex: 2 },
        { id: 89, type: "multiple-choice", options: ["害怕误删", "提高工作效率", "方便查找存储记录", "防止关键信息丢失"], correctIndex: 1 },
        { id: 90, type: "multiple-choice", options: ["垃圾文件要定期清理", "电脑有自我保护的功能", "文件不会轻易被彻底删除", "电脑运行速度与硬盘有关"], correctIndex: 2 }
      ]
    },
    {
      id: "writing",
      title: "书写 (Writing)",
      instructions: "第一部分: 第 91-98 题: 完成句子。\n第二部分: 第 99-100 题: 写短文。",
      questions: [
        { id: 91, type: "ordering", options: ["结果将在", "公布", "月底", "录取"], correctAnswer: "录取结果将在月底公布。" },
        { id: 92, type: "ordering", options: ["他", "自信", "承认自己", "缺乏"], correctAnswer: "他承认自己缺乏自信。" },
        { id: 93, type: "ordering", options: ["参加其他优惠", "打折商品", "活动", "不再"], correctAnswer: "打折商品不再参加其他优惠活动。" },
        { id: 94, type: "ordering", options: ["汽油的", "上涨", "价格", "又", "了"], correctAnswer: "汽油的价格又上涨了。" },
        { id: 95, type: "ordering", options: ["这两家", "差别", "公司的待遇", "很大"], correctAnswer: "这两家公司的待遇差别很大。" },
        { id: 96, type: "ordering", options: ["小姑娘", "非常", "那个", "孝顺"], correctAnswer: "那个小姑娘非常孝顺。" },
        { id: 97, type: "ordering", options: ["请在", "办理入住", "手续", "前台"], correctAnswer: "请在前台办理入住手续。" },
        { id: 98, type: "ordering", options: ["风俗习惯", "保留着一些古老", "这里还", "的"], correctAnswer: "这里还保留着一些古老的风俗习惯。" },
        { id: 99, type: "writing", instructions: "请结合下列词语，写一篇 80 字左右的短文: 博物馆 保存 讲解员 丰富 值得" },
        { id: 100, type: "writing", instructions: "请结合这张图片写一篇 80 字左右 of the short text." }
      ]
    }
  ]
};
