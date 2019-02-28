import { Component,OnInit } from '@angular/core';
import { koreBotChat } from '../assets/chatWindow.js';
import { koreAnonymousFn } from '../assets/anonymousassertion.js';
import { reject } from 'q';
import { HttpClient } from '@angular/common/http';
import * as $ from '../assets/libs/jquery';
//import { Options } from 'selenium-webdriver/opera';

declare var koreBotChat:any;
declare var koreAnonymousFn:any;
var koreBot = koreBotChat();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{  
  chatConfig: any;  
  botOptions: any;
  anonymousFn: any;
  constructor(private http: HttpClient){
    //this.koreBot=koreBotChat();
    this.botOptions = {
      logLevel: "debug",
      botInfo: {name:"BPMBot","_id":"st-9a32815d-9414-5258-9538-f317afbcc9bf"}, // bot name is case sensitive
      clientId: "cs-ab016638-fb6d-5270-babc-0af6e9cda43d",
      clientSecret: "ElBU2Nq9NqMO7vB8hMiuQV2kbLWtiVFNotjDM25w0TQ=",
      koreAPIUrl: "https://bots.kore.ai/api/",
      koreSpeechAPIUrl: "https://speech.kore.ai/",
      ttsSocketUrl: 'wss://speech.kore.ai/tts/ws',
      recorderWorkerPath: '../libs/recorderWorker.js',
      userIdentity: 'vamsi.kallam@hcl.com',// Provide users email id here
      JWTUrl: 'http://localhost:8082/jwtToken'
    }
  } //end of constructor 
  
  ngOnInit(){
    this.botOptions.assertionFn = this.assertionFn;
    this.botOptions.koreAnonymousFn = koreAnonymousFn;    
  } // end of Init

  assertionFn(options, callback) {
    var jsonData = {
      "clientId": options.clientId,
      "clientSecret": options.clientSecret,
      "identity": options.userIdentity,
      "aud": "",
      "isAnonymous": false
    };
    $.ajax({
      url: options.JWTUrl,
      type: 'post',
      data: jsonData,
      dataType: 'json',
      success: function (data) {
        options.assertion = data.token;
        options.handleError = koreBot.showError;
        options.chatHistory = koreBot.chatHistory;
        options.botDetails = koreBot.botDetails;
        callback(null, options);
        setTimeout(function () {
          if (koreBot && koreBot.initToken) {
            koreBot.initToken(options);            
          }
        }, 2000);
      },
      error: function (err) {
        koreBot.showError(err.responseText);
      }
    });        
  } //end of assertion

  assertion(){
     this.chatConfig={
      botOptions:this.botOptions,
      allowIframe: false,
      isSendButton: false,
      isTTSEnabled: true,
      isSpeechEnabled: false,
      allowGoogleSpeech: false,
      allowLocation: false,
      loadHistory: true,
      messageHistoryLimit: 10,
      autoEnableSpeechAndTTS: false,
      graphLib: "d3"
    };    
    koreBot.show(this.chatConfig);
  }

} //end of class

