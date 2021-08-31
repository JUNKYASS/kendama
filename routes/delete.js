class Router {
  delete(body) {
    let result = [];
    let i = 0;

    switch(body.moduleTable) {
      case 'system_holder' : i++; result.push({warningStatus: 0, executedTimes: 1}); break;
      case 'folder'        : i++; result.push({warningStatus: 0, executedTimes: 2}); break;
      case 'product'       : i++; result.push({warningStatus: 0, executedTimes: 3}); break;
      case 'image'         : i++; result.push({warningStatus: 0, executedTimes: 4});  break;
      default              : result = 'Ошибка выбора таблицы';
    }

    if(result[0].warningStatus == 0) {
      return {
        message: '<i class="icon-check"></i> Запись удалена',
        result: result,
        success: true
      };
    } else {
      return {
        message: 'Отказано в доступе',
        result: result,
        success: false
      };
    }
  }
}

module.exports = Router;
