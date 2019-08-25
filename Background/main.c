#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>
#include <winuser.h>
#include <windowsx.h>
#include <process.h>
#include <node_api.h>
#include <ctype.h>

size_t BUFFER = 256;
char *substring(char *string, int position, int length)
{
   char *pointer;
   int c;

   pointer = calloc(1,length+1);

   if (pointer == NULL)
   {
      printf("Unable to allocate memory.\n");
      exit(1);
   }

   for (c = 0 ; c < length ; c++)
   {
     if(!islower(c))
     {
      *(pointer+c) = *(string+position-1);
      string++;
    }

   }

   *(pointer+c) = '\0';

   return pointer;
}
int get_keys(char* correctCombo)
{
           short character;
           char* keycombo=calloc(1,sizeof(char)*BUFFER);
             while(1)
             {
               //printf("%d, %d\n",strlen(keycombo), strlen(correctCombo));
              //printf("Keycombo %s\n",keycombo);
               //printf("Last Few %s\t%s\n",substring(keycombo,strlen(keycombo)-strlen(correctCombo)+1,strlen(keycombo)),correctCombo);
                    if(strlen(keycombo)>=strlen(correctCombo)-1)
                    {
                      if(strcmp(substring(keycombo,strlen(keycombo)-strlen(correctCombo)+1,strlen(keycombo)),correctCombo)==0)
                      {
                        //printf("Success\n");
                        free(keycombo);
                        keycombo="";
                        return 1;
                      }

                    }
                    else
                    {
                      //memmove(keycombo, keycombo+1, strlen(correctCombo));
                    }

                    Sleep(10);/*to prevent 100% cpu usage*/
                    for(character=8;character<=127;character++)
                    {
                        if(GetAsyncKeyState(character)==-32767)
                        {

                                    if((character>=48)&&(character<=57))
                                    {
                                          /*char c = character;
                                          char *temp=malloc(sizeof(char));
                                          *temp=c;
                                          strncat(keycombo,temp,BUFFER);
                                          keyLen++;*/
                                          break;
                                    }
                                    else if((character>64)&&(character<91))
                                    {
                                          //character+=32;
                                          char c = character;
                                          char *temp=calloc(1,sizeof(char));
                                          *temp=c;
                                          //char* temp = character+'';
                                          //printf("%c\n",temp);
                                          strncat(keycombo,temp,BUFFER);
                                          //keyLen++;
                                          break;
                                    }
                                    else
                                    {
                                        switch(character)
                                        {
                                              case VK_SPACE:
                                              strncat(keycombo," ",BUFFER);
                                              break;
                                              case VK_SHIFT:
                                              strncat(keycombo,"[SHIFT]",BUFFER);
                                              break;
                                              case VK_RETURN:
                                              strncat(keycombo,"\n[ENTER]",BUFFER);
                                              break;
                                              case VK_BACK:
                                              strncat(keycombo,"[BACKSPACE]",BUFFER);
                                              break;
                                              case VK_TAB:
                                              strncat(keycombo,"[TAB]",BUFFER);
                                              break;
                                              case VK_CONTROL:
                                              strncat(keycombo,"[CTRL]",BUFFER);
                                              break;
                                              case VK_DELETE:
                                              strncat(keycombo,"[DEL]",BUFFER);
                                              break;
                                              case VK_OEM_1:
                                              strncat(keycombo,"[;:]",BUFFER);
                                              break;
                                              case VK_OEM_2:
                                              strncat(keycombo,"[/?]",BUFFER);
                                              break;
                                              case VK_OEM_3:
                                              strncat(keycombo,"[`~]",BUFFER);
                                              break;
                                              case VK_OEM_4:
                                              strncat(keycombo,"[ [{ ]",BUFFER);
                                              break;
                                              case VK_OEM_5:
                                              strncat(keycombo,"[\\|]",BUFFER);
                                              break;
                                              case VK_OEM_6:
                                              strncat(keycombo,"[ ]} ]",BUFFER);
                                              break;
                                              case VK_OEM_7:
                                              strncat(keycombo,"['\"]",BUFFER);
                                              break;
                                              case VK_NUMPAD0:
                                              strncat(keycombo,"0",BUFFER);
                                              break;
                                              case VK_NUMPAD1:
                                              strncat(keycombo,"1",BUFFER);
                                              break;
                                              case VK_NUMPAD2:
                                              strncat(keycombo,"2",BUFFER);
                                              break;
                                              case VK_NUMPAD3:
                                              strncat(keycombo,"3",BUFFER);
                                              break;
                                              case VK_NUMPAD4:
                                              strncat(keycombo,"4",BUFFER);
                                              break;
                                              case VK_NUMPAD5:
                                              strncat(keycombo,"5",BUFFER);
                                              break;
                                              case VK_NUMPAD6:
                                              strncat(keycombo,"6",BUFFER);
                                              break;
                                              case VK_NUMPAD7:
                                              strncat(keycombo,"7",BUFFER);
                                              break;
                                              case VK_NUMPAD8:
                                              strncat(keycombo,"8",BUFFER);
                                              break;
                                              case VK_NUMPAD9:
                                              strncat(keycombo,"9",BUFFER);
                                              break;
                                              case VK_CAPITAL:
                                              strncat(keycombo,"[CAPS LOCK]",BUFFER);
                                              break;
                                              case VK_ESCAPE:
                                              strncat(keycombo,"[ESCAPE]",BUFFER);
                                              break;
                                              default:
                                              break;
                                       }
                                       //keyLen++;

                             }
                   }
               }

           }
           return EXIT_SUCCESS;
}

int hotKeyListener(char* correctCombo)
{
  //Look for certain keycombo
  //
  //
  //
  //
  //////////////////////NEEDS TO BE ALL IN CAPS///////////////////////////
        int keyComboPressed=get_keys(correctCombo);
        return keyComboPressed;

}
napi_value MyFunction(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 1;
  int number = 0;
  napi_value argv[1];
  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  char* temp=(char*)malloc(sizeof(char)*BUFFER);
  size_t* result=0;
  status=napi_get_value_string_utf8(env,argv[0], temp, BUFFER, result);
  int temp2=hotKeyListener(temp);
  napi_value rV;
  status = napi_create_int32(env,temp2, &rV);
  return rV;
  //return 0;
  /*
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Failed to parse arguments");
  }

  status = napi_get_value_int32(env, argv[0], &number);

  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Invalid number was passed as argument");
  }
  napi_value myNumber;
  number = number * 2;
  status = napi_create_int32(env, number, &myNumber);

  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to create return value");
  }

  return myNumber;*/
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;
  status = napi_create_function(env, NULL, 0, MyFunction, NULL, &fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to wrap native function");
  }

  status = napi_set_named_property(env, exports, "hotKeyListener", fn);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Unable to populate exports");
  }

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
