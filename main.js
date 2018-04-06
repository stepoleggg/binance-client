const TelegramBot = require('node-telegram-bot-api');
const token = '522266944:AAGbA5zLPZMeWnCORm58WwbGJV5ly5FCr4s';
const bot = new TelegramBot(token, {polling: true});
const account = "440211885";
const binance = require('node-binance-api');
binance.options({
  APIKEY: 'eLfIfX4kbY3KsboMeOo5K9juLepZIsXM2t34FTukGReqkHTLCOm52PHzv2tXVRNo',
  APISECRET: 'vDujNRjr36xB2QpIyDHr9pNNP3E4bxUgTfZRofb5iJaEpu2a3ue7N1NHTI3jcdZr',
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: true // If you want to use sandbox mode where orders are simulated
});

const ph = [
    "Извините, для этого аккаунта бот не работает",
    "Добро пожаловать в главное меню! Для доступа к функциям жмите на кнопки."
];

const last = 5;
var orders_story = 0;
var orders_pair = "";

var trade_story = 0;
var trade_pair = "";


var o_pair;
var o_type;
var o_o;
var o_qty;
var o_price;

var stage = 0;
bot.onText(/.+/u, (msg, match) => {
    const chatId = msg.chat.id;
    var text = msg.text;
    console.log(text, chatId);
    
    if(chatId==account){
        switch(stage){
            case 0:
                //console.log(stage);
                switch(text){
                    case "/start":
                        sendMenu(chatId);
                        break
                    case "Баланс":
                        stage = 1;
                        sendBalance(chatId);
                        break
                    case "Ордера":
                        stage = 6;
                        sendOrders(chatId);
                        break
                    case "История сделок":
                        stage = 2;
                        sendChooseTradeHistory(chatId);
                        break
                    case "История ордеров":
                        stage = 4;
                        sendChooseTradeHistory(chatId);
                        break
                    case "Настройки комиссий":
                        break
                    default:
                        sendMenu(chatId);
                }
                break
            case 1:
                //console.log(stage);
                switch(text){
                    case "В главное меню":
                        stage = 0;
                        sendMenu(chatId);
                        break
                    default:
                        sendBalance(chatId);
                }
                break;
            case 2:
                //console.log(stage);
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    default:
                        if(text.substr(-3).toUpperCase() === "BTC" || text.substr(-3).toUpperCase() === "ETH" || text.substr(-3).toUpperCase() === "BNB" || text.substr(-4).toUpperCase() === "USDT"){
                            stage = 3;
                            trade_story = 0;
                            trade_pair = text.toUpperCase();
                            sendTradeHistory(trade_pair,chatId,trade_story);
                        }else{
                            sendChooseTradeHistoryError(chatId);
                        }
                }
                break
            case 3:
                //console.log(stage);
                switch(text){
                    case "В главное меню":
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        stage = 2;
                        sendChooseTradeHistory(chatId);
                        break
                    case "Ещё":
                        trade_story++;
                        sendTradeHistory(trade_pair,chatId,trade_story);
                        break
                    default:
                }
                break
            case 4:
                //console.log(stage);
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    default:
                        if(text.substr(-3).toUpperCase() === "BTC" || text.substr(-3).toUpperCase() === "ETH" || text.substr(-3).toUpperCase() === "BNB" || text.substr(-4).toUpperCase() === "USDT"){
                            stage = 5;
                            orders_pair = text.toUpperCase();
                            //console.log(stage);
                            orders_story = 0;
                            sendOrdersHistory(orders_pair,chatId,orders_story);
                        }else{
                            sendChooseTradeHistoryError(chatId);
                        }
                }
                break
            case 5:
                //console.log(stage);
                switch(text){
                    case "В главное меню":
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        stage = 4;
                        sendChooseTradeHistory(chatId);
                        break
                    case "Ещё":
                        orders_story++;
                        sendOrdersHistory(orders_pair,chatId,orders_story);
                        break
                    default:
                }
                break
            case 6:
                //console.log(stage);
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Новый ордер":
                        stage = 7;
                        sendChooseTypeOrder(chatId);
                        break
                    default:

                }
                break
            case 7:
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        stage = 6;
                        sendOrders(chatId);
                        break
                    case "Limit":
                        stage = 9;
                        o_o = "Limit";
                        sendSetLimit(chatId);
                        break
                    case "Market":
                        stage = 9;
                        o_o = "Market";
                        sendSetLimit(chatId);
                        break  
                    case "Stop-limit":
                        stage = 9;
                        o_o = "Stop-limit";
                        sendSetLimit(chatId);
                        break
                    default:

                }
                break
            case 8:
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        //console.log("what");
                        stage = 9;
                        sendSetLimit(chatId);
                        break
                    default:
                        if(text.substr(-3).toUpperCase() === "BTC" || text.substr(-3).toUpperCase() === "ETH" || text.substr(-3).toUpperCase() === "BNB" || text.substr(-4).toUpperCase() === "USDT"){
                            stage = 10;
                            o_pair = text;
                            sendValueOrder(chatId);
                        }else{
                            sendChooseError(chatId);
                        }
                }
                break
            case 9:
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        stage = 7;
                        sendChooseTypeOrder(chatId);
                        break
                    case "BUY":
                        stage = 8;
                        o_type = "BUY";
                        sendChoose(chatId);
                        break
                    case "SELL":
                        stage = 8;
                        o_type = "SELL";
                        sendChoose(chatId);
                        break
                    default:

                }
                break
            case 10:
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        stage = 8;
                        sendChoose(chatId);
                        break
                    default:
                        if(text.match(/\d+(\.(\d){1,8})?/g)&&text!=0){
                            o_qty = text;
                            if(o_o!="Market"){
                                stage = 11;
                                sendPriceOrder(chatId);
                            }else{
                                stage = 12;
                                sendMarket(o_pair,o_qty,o_type,chatId);
                            }
                            
                        }else{
                            sendValueError(chatId);
                        }

                }
                break
            case 11:
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        stage = 10;
                        sendValueOrder(chatId);
                        break
                    default:
                        if(text.match(/\d+(\.(\d){1,8})?/g)&&text!=0){
                            o_price = text;
                           // stage = 12;
                        }else{
                            sendPriceError(chatId);
                        }
                }
                break
            case 12:
                switch(text){
                    case "В главное меню":
                        //console.log("what");
                        stage = 0;
                        sendMenu(chatId);
                        break
                    case "Назад":
                        stage = 10;
                        sendValueOrder(chatId);
                        break
                    case "Да":
                        marketBuy(o_pair, o_qty, o_type, chatId);
                    default:

                }
                break
            
            
        }
    //console.log(stage);
    }else{
        bot.sendMessage(chatId, ph[0]);
    }
});

function marketBuy(o_pair, o_qty, o_type, chatId){
    if(o_type=="BUY"){
        binance.buy(o_pair, o_qty, {type:'MARKET'}, (error, response) => {
            if(response.orderId==undefined){
                bot.sendMessage(chatId, "Не удалось поставить ордер. Проверьте значения ещё раз.", {
                    "reply_markup": {
                    "keyboard": [["Назад","В главное меню"]]
                    }, 
                    "parse_mode" : "HTML"
                });
            }else{
                bot.sendMessage(chatId, "Ордер успешно установлен. Id ордера: "+response.orderId, {
                    "reply_markup": {
                    "keyboard": [["В главное меню"]]
                    }, 
                    "parse_mode" : "HTML"
                });
            }
          console.log("Market Buy response", response);
          console.log("order id: " + response.orderId);
          console.log("error: "+error);
          // Now you can limit sell with a stop loss, etc.
        });    
    }else{
        binance.sell(o_pair, o_qty, {type:'MARKET'}, (error, response) => {
            if(response.orderId==undefined){
                bot.sendMessage(chatId, "Не удалось поставить ордер. Проверьте значения ещё раз.", {
                    "reply_markup": {
                    "keyboard": [["Назад","В главное меню"]]
                    }, 
                    "parse_mode" : "HTML"
                });
            }else{
                bot.sendMessage(chatId, "Ордер успешно установлен. Id ордера: "+response.orderId, {
                    "reply_markup": {
                    "keyboard": [["В главное меню"]]
                    }, 
                    "parse_mode" : "HTML"
                });
            }
            
          console.log("Market Buy response", response);
          console.log("order id: " + response.orderId);
          console.log("error: "+error);
          // Now you can limit sell with a stop loss, etc.
        });    
    }

}

function sendMarket(o_pair, o_qty, o_type, chatId){
    if(o_type=="BUY"){
        var txt = "<b>"+o_pair+"</b>. Купить "+o_qty+" по рынку. Верно?";
    }else{
        var txt = "<b>"+o_pair+"</b>. Продать "+o_qty+" по рынку. Верно?";
    }
    bot.sendMessage(chatId, txt, {
        "reply_markup": {
        "keyboard": [["Да"],["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendPriceOrder(chatId){
    bot.sendMessage(chatId, "Введите цену (Например, 0.0123)", {
        "reply_markup": {
        "keyboard": [["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendValueOrder(chatId){
    bot.sendMessage(chatId, "Сколько покупаем/продаём? (Например, 0.0567)", {
        "reply_markup": {
        "keyboard": [["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendPriceError(chatId){
    bot.sendMessage(chatId, "Цена ведена неверно, попробуйте ещё раз (Например, 0.0123)", {
        "reply_markup": {
        "keyboard": [["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendValueError(chatId){
    bot.sendMessage(chatId, "Размер ордера введён неверно, попробуйте ещё раз (Например, 0.0567)", {
        "reply_markup": {
        "keyboard": [["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendSetLimit(chatId){
    bot.sendMessage(chatId, "Покупка/продажа?", {
        "reply_markup": {
        "keyboard": [["BUY","SELL"],["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendBalance(chatId){
    binance.balance((error, balances) => {
        var n=0;
        var txt="<b>Баланс</b>\n\n";
        for (var sembol in balances){
            if(balances[sembol].available=="0.00000000"&&balances[sembol].onOrder=="0.00000000"){
                //
                
            }else{
                //console.log(balances[sembol].available,"0.00000000");
                n++;
                txt+="<b>"+sembol+"</b> доступно: "+balances[sembol].available+" на ордерах: "+balances[sembol].onOrder+"\n";
            }
        }
        
        if(n==0){
            txt = "Ваш баланс пуст";
        }
        
        bot.sendMessage(chatId, txt, {
                            "reply_markup": {
                                "keyboard": [["В главное меню"]]
                            }, 
                            "parse_mode" : "HTML"
        });
    });
}

function sendChooseTradeHistory(chatId){
    bot.sendMessage(chatId, "Введите название пары (например, ETCBTC)", {
        "reply_markup": {
        "keyboard": [["В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendChoose(chatId){
    bot.sendMessage(chatId, "Введите название пары (например, ETCBTC)", {
        "reply_markup": {
        "keyboard": [["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendChooseError(chatId){
    bot.sendMessage(chatId, "Название пары введено неверно, попробуйте ещё раз (например, ETCBTC)", {
        "reply_markup": {
        "keyboard": [["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendChooseTradeHistoryError(chatId){
    bot.sendMessage(chatId, "Название пары введено неверно, попробуйте ещё раз (например, ETCBTC)", {
        "reply_markup": {
        "keyboard": [["В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendChooseTypeOrder(chatId){
    bot.sendMessage(chatId, "Выберите тип ордера", {
        "reply_markup": {
        "keyboard": [["Limit","Market","Stop-limit"],["Назад","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });
}

function sendOrdersHistory(pair, chatId, orders_story){
    binance.allOrders(pair, (error, orders, symbol) => {
        
        if(orders.length>last+orders_story*last){
            var orders_story_txt = (orders_story+1);
            var orders_story_txt2 = (orders_story+last);
            var txt="<b>"+pair+". История ордеров "+orders_story_txt+"-"+orders_story_txt2+"</b>\n\n";
            var n=0;
            for(var i=orders.length-1-orders_story*last;i>=orders.length-last-orders_story*last;i--){
                n++;
                //console.log(trades[i].time);
                var side = orders[i].side;
                var type = orders[i].type;
                var time = new Date(orders[i].time);
                time = time.toUTCString();
                var price = orders[i].price;
                var qty = orders[i].origQty;
                var stat = orders[i].status;
                var exc = orders[i].executedQty;
                var ice = orders[i].icebergQty;
                
                txt+="<b>"+side+"</b> "+type+" <code>"+stat+"</code> "+qty+" по цене "+price+"\nИсполненно "+exc+", осталось "+ice+" "+time+"\n";
            }
            
            bot.sendMessage(chatId, txt, {
                "reply_markup": {
                    "keyboard": [["Ещё","В главное меню","Назад"]]
                }, 
                "parse_mode" : "HTML"
            });   
            
        }else{
            var orders_story_txt = (orders_story*last+1);
            var orders_story_txt2 = (orders.length);
            var txt="<b>"+pair+". История ордеров "+orders_story_txt+"-"+orders_story_txt2+"</b>\n\n";
            var n=0;
            for(var i=orders.length-1-orders_story*last;i>=0;i--){
                n++;
                //console.log(trades[i].time);
                var side = orders[i].side;
                var type = orders[i].type;
                var time = new Date(orders[i].time);
                time = time.toUTCString();
                var price = orders[i].price;
                var qty = orders[i].origQty;
                var stat = orders[i].status;
                var exc = orders[i].executedQty;
                var ice = orders[i].icebergQty;
                
                txt+="<b>"+side+"</b> "+type+" <code>"+stat+"</code> "+qty+" по цене "+price+"\nИсполненно "+exc+", осталось "+ice+" "+time+"\n";
            }
            
            if(n==0){
                txt="Ордеров по паре <b>"+pair+"</b> не найдено";   
            }  
            
            bot.sendMessage(chatId, txt, {
                "reply_markup": {
                    "keyboard": [["В главное меню","Назад"]]
                }, 
                "parse_mode" : "HTML"
            });   
        }

        
             
        
        //console.log(symbol+" orders:", orders);
    });
}

function sendOrders(chatId){
    var txt = "Ордера. Выберите раздел";
    bot.sendMessage(chatId, txt, {
        "reply_markup": {
           "keyboard": [["Новый ордер"],["Открытые ордера","В главное меню"]]
        }, 
        "parse_mode" : "HTML"
    });  
}

function sendTradeHistory(pair, chatId, trade_story){
    binance.trades(pair,(error, trades, symbol) => {
        
        if(trades.length>last+trade_story*last){
            
            var trade_story_txt = (trade_story+1);
            var trade_story_txt2 = (trade_story+last);
            var txt="<b>"+pair+". История сделок "+trade_story_txt+"-"+trade_story_txt2+"</b>\n\n";
            var n=0;
            
            for(var i=trades.length-1-trade_story*last;i>=trades.length-last-trade_story*last;i--){
                n++;
                //console.log(trades[i].time);
                if(trades[i].isBuyer){
                    var type = "<b>BUY</b>";
                }else{
                    var type = "<b>SELL</b>";
                }
                var time = new Date(trades[i].time);
                time = time.toUTCString();
                var price = trades[i].price;
                var qty = trades[i].qty;
                var comission = trades[i].commission+" "+trades[i].commissionAsset;
                
                txt+=type+" "+qty+" по цене "+price+" c комиссией "+comission+" "+time+"\n";
            }  
            bot.sendMessage(chatId, txt, {
                "reply_markup": {
                    "keyboard": [["Ещё","В главное меню","Назад"]]
                }, 
                "parse_mode" : "HTML"
            });
        }else{
            
            var trade_story_txt = (trade_story*last+1);
            var trade_story_txt2 = (trades.length);
            var txt="<b>"+pair+". История сделок "+trade_story_txt+"-"+trade_story_txt2+"</b>\n\n";
            var n=0;
            
            for(var i=trades.length-1-trade_story*last;i>=0;i--){
                n++;
                //console.log(trades[i].time);
                if(trades[i].isBuyer){
                    var type = "<b>BUY</b>";
                }else{
                    var type = "<b>SELL</b>";
                }
                var time = new Date(trades[i].time);
                time = time.toUTCString();
                var price = trades[i].price;
                var qty = trades[i].qty;
                var comission = trades[i].commission+" "+trades[i].commissionAsset;
                
                txt+=type+" "+qty+" по цене "+price+" c комиссией "+comission+" "+time+"\n";
            }
            
            if(n==0){
                txt="Сделок по паре <b>"+pair+"</b> не найдено";   
            }
            
            bot.sendMessage(chatId, txt, {
                "reply_markup": {
                    "keyboard": [["В главное меню","Назад"]]
                }, 
                "parse_mode" : "HTML"
            });
        }
        

        

    });
}

function sendMenu(chatId){
    bot.sendMessage(chatId, ph[1], {
        "reply_markup": {
            "keyboard": [["Баланс", "Ордера"],   ["История сделок","История ордеров"]]
        }
    });
}