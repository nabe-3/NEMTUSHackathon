## NEMTUSHackathon
https://hackathon-2022.nemtus.com/  
ハッカソン参加用のゲームプログラムです。    
プレイは以下。  
https://nabe-3.github.io/NEMTUSHackathon/  
注意：ブラウザがChromeの場合、SSS Extensionプラグインが有効だと正常に動作しません。

## 作品コンセプト
視聴者参加型の実況配信用ゲームです。  
実況配信中のゲームに対して視聴者がSymbolのトランザクションを使って  
投げXYMと同時に応援したり、コメントしたり、ときには邪魔をしたりできます。  
本ゲームにより、普段Symbolに興味の無い層へSymbolを普及させるとともに、  
大量のトランザクションを発生させることができます。  
配信者は投げXYMを得られ、視聴者は配信者と一緒に楽しむことができ、  
更にはトランザクション手数料でXYMホルダーが儲かる。  
一石三鳥のつよつよコンセプトです。  

## 必要なもの
・ブラウザ  
・矢印キーのある入力装置（キーボード、テンキー等）  

## 遊び方
矢印キーで紫色の自機を操作して玉を避けてください。  
Symbolメインネットのトランザクションを送ると、ゲームに影響を与えることが出来ます。  
GAME OVERになってから送っても反映されます。  

![symball](https://user-images.githubusercontent.com/99067358/153734839-59b3af2a-ab94-44ec-b295-98307a0430b0.png)

## コマンドの送り方
Symbolのメインネットで以下のトランザクションを送ってください。  
  
宛先アドレス：NCJELEW7XZAYFS56PXW5RCL5CWABTT5YVLO6BFY  
XYM転送量：0XYM以外（0.000001以上であればOK）  
コマンド  
　メッセージ欄に以下のいずれかのコマンドを記入してトランザクションを発行してください。  
　・ball_add    ：ボールが3個増えます  
　・life_up    ：自機のライフが2機増えます。ボールも1個増えます。  
　・speed_up    ：自機の移動速度がアップします  
　・speed_down    ：自機の移動速度がダウンします  
　・score_up    ：転送したXYMの数量分スコアがアップします（ボールが速くなります）  
　・上記以外のテキストを記入すると、記入したテキストがゲーム画面上に表示されます。  
 　 　半角英数字で記入してください。  

## 本作のSymbolブロックチェーン活用箇所
webSocketで上記のアドレスへのunconfirmedAddedのイベントを購読しています。  
unconfirmedAddedのイベントを受け取ると、トランザクションの中のメッセージを読み出します。  
そのメッセージの内容に応じてゲーム内の各種パラメータをいじったり、コメントを画面上に表示させたりしています。  
今回は数種類のコマンドを実装しただけですが、アイデア次第で様々な活用が可能な手法です。  
以上の通り、トランザクションにモザイクの移動やブロックチェーンへの記録と言ったこと以外の価値を持たせました。  
これによりSymbolが広く活用されることに繋がれば良いと考えています。
