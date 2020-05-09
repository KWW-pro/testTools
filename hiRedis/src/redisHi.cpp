#include "../include/redisHi.hpp"
int main(int argc, char* argv[])
{
    HiRedisOption tmp(argc,argv);
    hrp = tmp;
    
    pthread_t ptmp[hrp.getconnectCount()];
    void* rtn;
    int i,j,k;
    float ftmp;
    char path[128];
    memset(path,0,sizeof(path));
    int r=readlink("/proc/self/exe", path, sizeof(path));
    for(i=r;i>=0;i--)
    {
	if(path[i]=='/')
	{
		path[i + 1]='\0';
		break;
	}
    }
    string tmpPath=path;
    tmpPath += "/../log/redisHi.log";
    log.set_log_path(tmpPath.c_str());
    
    if(!hrp.getisCommondTrue())
    {
	log.logPrint(1,"redisHi","TaskId error");
        return 1;
    }
    
    log.logPrint(3,"redisHi","Task:%s start",hrp.gettaskId().c_str());
    for(i=0;i<hrp.getvalueSize();i++)
    {
        VALUE += "a";
    }
    
    tmpPath=path;
    tmpPath += "/../etc/dataMysql.conf";
    mysqlInit(tmpPath.c_str());
    sql = "INSERT INTO REDIS_TEST (TASK_ID,TEST_TYPE) VALUES (\"" + hrp.gettaskId() + "\",\"hiRedis\");";
    if(exeSql(sql))
    {
	    log.logPrint(3,"redisHi","execute success SQL:%s",sql.c_str());
    }
    else
    {
        log.logPrint(1,"redisHi","execute fail SQL:%s",sql.c_str());
	    return 1;
    }
    
    if(hrp.getcommandList().length() == 0)
    {
        for(i=0;i<COMMONDCOUNT;i++)
        {
            startT = getTimeUsec();
            for(int j=0;j<hrp.getconnectCount();j++)
            {
                ptmp[j]=threadMake(i);
            }
            for(j=0;j<hrp.getconnectCount();j++)
            {
                pthread_join(ptmp[j],&rtn);
            }
            stopT = getTimeUsec();
            ftmp = (float)(stopT-startT)/1000;
	    stmp =to_string(hrp.getrequestCount()*1000/ftmp);	        
            sql = "UPDATE `REDIS_TEST` SET `" + list[i] + "` = " + stmp + " WHERE `TEST_TYPE` = 'hiRedis' AND `TASK_ID` = '" + hrp.gettaskId() + "';";
	    if(exeSql(sql))
            {
                log.logPrint(3,"redisHi","execute success SQL:%s",sql.c_str());
            }
            else
            {
                log.logPrint(1,"redisHi","execute fail SQL:%s",sql.c_str());
		        return 1;
            }
            
        }
    }
    
    else
    {
        int commondCount = -1;
        int commondIndex = 0;
        int lasti = -1;
        string commond;
        for(j=0;j<hrp.getcommandList().length();j++)
        {
            if(hrp.getcommandList()[j] == ',')
            {
                commondCount++;
                commondIndex = lasti + 1;
                commond = hrp.getcommandList().substr(commondIndex,hrp.getcommandList().length()-lasti-1);
                lasti =j;
                for(i=0;i<COMMONDCOUNT;i++)
                {
                    if(commond == list[i])
                    {
                        startT = getTimeUsec();
                        for(k=0;k<hrp.getconnectCount();k++)
                        {
                            ptmp[k]=threadMake(i);
                        }
                        for(k=0;k<hrp.getconnectCount();k++)
                        {
                            pthread_join(ptmp[k],&rtn);
                        }
                        stopT = getTimeUsec();
                        ftmp = (float)(stopT-startT)/1000;
			stmp = to_string(hrp.getrequestCount()*1000/ftmp);	        
                        sql = "UPDATE `REDIS_TEST` SET `" + list[i] + "` = " + stmp + " WHERE `TEST_TYPE` = 'hiRedis' AND `TASK_ID` = '" + hrp.gettaskId() + "';";
			if(exeSql(sql))
                        {
                            log.logPrint(3,"redisHi","execute success SQL:%s",sql.c_str());
                        }
                        else
                        {
                            log.logPrint(1,"redisHi","execute fail SQL:%s",sql.c_str());
                            return 1;
                        }
                    }
                }
            }           
        }
        commondCount++;
        commondIndex = lasti + 1;
        commond = hrp.getcommandList().substr(commondIndex,hrp.getcommandList().length()-lasti-1);
        for(i=0;i<COMMONDCOUNT;i++)
            {
                if(commond == list[i])
                {
                    startT = getTimeUsec();
                    for(k=0;k<hrp.getconnectCount();k++)
                    {
                        ptmp[k]=threadMake(i);
                    }
                    for(k=0;k<hrp.getconnectCount();k++)
                    {
                        pthread_join(ptmp[k],&rtn);
                    }
                    stopT = getTimeUsec();
                    ftmp = (float)(stopT-startT)/1000;
                    stmp = to_string(hrp.getrequestCount()*1000/ftmp);	        
                    sql = "UPDATE `REDIS_TEST` SET `" + list[i] + "` = " + stmp + " WHERE `TEST_TYPE` = 'hiRedis' AND `TASK_ID` = '" + hrp.gettaskId() + "';";
                    if(exeSql(sql))
                    {
                        log.logPrint(3,"redisHi","execute success SQL:%s",sql.c_str());
                    }
                    else
                    {
                        log.logPrint(1,"redisHi","execute fail SQL:%s",sql.c_str());
                        return 1;
                    }
                }
            }
    }
    
    mysql_close(mysql);
    return 0;
}


pthread_t threadMake(int i)
{
    long arg = i;
    pthread_t pthread;
    pthread_create(&pthread,NULL,thread_main,(void*)arg);
    return pthread;
}


void* thread_main(void* arg)
{
    long long_i = (long)arg;
    int i =(int)long_i;
    redisContext *myRedis;
    //redisReply *reply;
    char commond[128];
    char authCommond[128];
    memset(authCommond,0,128);
    memset(commond,0,128);
    long startThread;
    long stopThread;
    switch (i)
        {
        case 0:
            sprintf(commond,"SET string:__hiRedis__ %s",VALUE.c_str());
            break;
        case 1:
            sprintf(commond,"GET string:__hiRedis__ %s",VALUE.c_str());
            break;
        case 2:
            sprintf(commond,"INCR incr:__hiRedis__ %s",VALUE.c_str());
            break;
        case 3:
            sprintf(commond,"LPUSH list:__hiRedis__ %s",VALUE.c_str());
            break;
        case 4:
            sprintf(commond,"RPUSH list:__hiRedis__ %s",VALUE.c_str());
            break;
        case 5:
            sprintf(commond,"LPOP list:__hiRedis__ %s",VALUE.c_str());
            break;
        case 6:
            sprintf(commond,"RPOP list:__hiRedis__ %s",VALUE.c_str());
            break;
        case 7:
            sprintf(commond,"SADD set:__hiRedis__ %s",VALUE.c_str());
            break;
        case 8:
            sprintf(commond,"HSET hash:__hiRedis__ hash:__hiRedis__ %s",VALUE.c_str());
            break;
        case 9:
            sprintf(commond,"SPOP set:__hiRedis__ %s",VALUE.c_str());
            break;
        case 10:
	        //sprintf(keytmp,"list:__hiRedis__%i",rand()%100);
            //sprintf(commond,"LRANGE %s 0 99",keytmp);
            sprintf(commond,"LRANGE list:__hiRedis__ 0 99");
            break;
        case 11:
	        //sprintf(keytmp,"list:__hiRedis__%i",rand()%100);
            //sprintf(commond,"LRANGE %s 0 299",keytmp);
            sprintf(commond,"LRANGE list:__hiRedis__ 0 299");
            break;
        case 12:
	        //sprintf(keytmp,"list:__hiRedis__%i",rand()%100);
            //sprintf(commond,"LRANGE %s 0 499",keytmp);
            sprintf(commond,"LRANGE list:__hiRedis__ 0 499");
            break;
        case 13:
	        ///sprintf(keytmp,"list:__hiRedis__%i",rand()%100);
            //sprintf(commond,"LRANGE %s 0 599",keytmp);
            sprintf(commond,"LRANGE list:__hiRedis__ 0 599");
            break;
        case 14:
            sprintf(commond,"MSET m1test %s m2test %s m3test %s m4test %s m5test %sm6test %s m7test %s m8test %s m9test %s m10test %s",VALUE.c_str(),VALUE.c_str(),VALUE.c_str(),VALUE.c_str(),VALUE.c_str(),VALUE.c_str(),VALUE.c_str(),VALUE.c_str(),VALUE.c_str(),VALUE.c_str());
            break;
        default:
            break;
        }
    myRedis=redisConnect(hrp.gethost().c_str(),hrp.getport());
    if(hrp.getPassword().length() > 0)
    {
	    sprintf(authCommond,"AUTH %s",hrp.getPassword().c_str());
	    //reply = (redisReply *)redisCommand(myRedis,authCommond);
	    redisCommand(myRedis,authCommond);
	    //if(reply->type == 5)
	    //{
	    //	    log.logPrint(1,"REDISDATA","AUTH success: %s",authCommond);
	    //}
	    //else
	    //{
	    //	    log.logPrint(3,"REDISDATA","AUTH fail: %s",authCommond);
	    //}
    }
    //startThread = getTimeUsec();
    int request = hrp.getrequestCount() / hrp.getconnectCount();
    for (int n=0;n<request;n++)
    {
        //reply = (redisReply *)redisCommand(myRedis,commond);
    	redisCommand(myRedis,commond);
    }
    //stopThread = getTimeUsec();
    //log.logPrint(3,"REDISDATA","%d %s used %ld us",request,commond,stopThread-startThread);
    //freeReplyObject(reply);
    pthread_exit(NULL);
}


long getTimeUsec()
{
    struct timeval t;
    gettimeofday(&t, 0);
    return (long)((long)t.tv_sec * 1000 * 1000 + t.tv_usec);
}

bool mysqlInit(const char* confPath)
{
    mysql=mysql_init(NULL);
    libconfig::Config config;
    config.readFile(confPath);
    string mysqlHost = config.lookup("mysqlHost");
    string mysqlUser = config.lookup("mysqlUser");
    string mysqlPassword = config.lookup("mysqlPassword");
    string mysqlDbname = "test_tools";
    int mysqlPort = config.lookup("mysqlPort");
    mysql = mysql_real_connect(mysql,mysqlHost.c_str(),mysqlUser.c_str(),mysqlPassword.c_str(),mysqlDbname.c_str(),mysqlPort, NULL, 0);
    if(mysql == NULL)
    {
        log.logPrint(1,"redisHi","connect fail mysql %s:%d",mysqlHost.c_str(),mysqlPort);
        return false;
    }
    else
    {
        log.logPrint(3,"redisHi","connect success mysql %s:%d",mysqlHost.c_str(),mysqlPort);
        return true;
    }
    
}
bool exeSql(string sql)
{
    if (mysql_query(mysql,sql.c_str()))
    {
        return false;
    }
    return true;
}
