const Router = require('./delete.js');
const router = new Router;

describe('Метод delete:', () => {
  let result;
  let response;

  test('результат должен вернуть success: true', () => {
    response = router.delete({moduleTable: 'system_holder'});
    expect(response.success).toBeTruthy();
  });

  test('результат должен вернуть значение default для case', () => {
    response = router.delete({moduleTable: 'undefined table'});
    expect(response.result).toBe('Ошибка выбора таблицы');
  });

  test('результат должен вернуть success: false', () => {
    response = router.delete('qwerty');
    expect(response.success).toBeFalsy();
  });

  test('кол-во проходов цикла должно быть равно 3', () => {
    response = router.delete({moduleTable: 'product'});
    expect(response.result[0].executedTimes).toEqual(3);
  });
});
