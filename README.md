# chatbox

這次我們主要是以nodejs當作網頁的server作為開發。 nodejs 比起其他的好處是其語言的統一性以及 處理多個thread的有效性較其他server程式
來的好，但是nodejs的壞處就是其一開始主要是以小架構為目標的。所以統整性，完整性，嚴謹性沒有像 php, java來的好。 但是我們就先start做吧!


目前已經做好的工作及架構描述:  
	1. index.js:  
		這是所有網頁的總控制中心，擔任controller的腳色  
	2. view資料夾: 裡面放的就是主要的html跟ejs,   
		- registration.html:  
			註冊的網頁，我覺得他要修改成浮現的形式(可能需要重寫)  
		- index.ejs :  
			ejs所代表的其實是一種網頁形式，他可以在html裡面嵌入js code, for example : <%=uesrname %> 裡面就  
			可以直接鑲嵌變數，會隨著不同的user裡面的取值會不相同。  
		- profile.html:  
			目前只是做好了一個架構，理想上他應該是要在server上面拿檔案取值，(也就是server上面有她的資料，不管是jason的形式會是whatever)，  
			這個網頁的要讓user可以看到自己的基本資料。 方式是要讓index.js能夠從server的電腦中的某個database取值，然後output到這個網頁。  
		- creat_channel.html:  
			這個網頁的目的是要讓人可以創造channel, channel這邊的意思是指直播網頁。 像twitch裡面我們進入某一個人的直播間的時候，會有如下，  
			"www.twitch.tv/OOXX", 這邊的OOXX是類似它名子之類的東西。所以我們要有一個創造channel的感覺，然後他必須是要跟帳戶綁再一起的。  
		- living_page.ejs:  
			這是我們網頁的核心，也就是說當我們進入直播間的時候應該要看到的東西，目前有聊天系統。 直播系統目前尚未開發，競標系統目前正在統合ing。  

人員分工:

