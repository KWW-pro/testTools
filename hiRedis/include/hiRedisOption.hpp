#include <iostream>
#include <unistd.h>
#include <time.h>
#include <string.h>
#include <string>
#include <getopt.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/time.h>
#include <hiredis/hiredis.h>
#include <stdio.h>
using namespace std;
class HiRedisOption
{
    private:
        string  taskId;
        string  host;
        int     port;
        int     connectCount;
        int     requestCount;
        int     valueSize;
        string  commandList;
        string 	password;
	bool    isCommondTrue;
	

	void    init();
        void    showHelp();
    public:
        string  gettaskId();
        string  gethost();
        int     getport();
        int     getconnectCount();
        int     getrequestCount();
        int     getvalueSize();
        string  getcommandList();
	string  getPassword();
	bool    getisCommondTrue();

        HiRedisOption();
        ~HiRedisOption();
        HiRedisOption(int argc,char **argv);
};
static  const   char *helpInfo = "usage: redisHi [--help][-h] [-H[=]<host>] [-P[=]<port>] [-A[=]<password>] [-T[=]<test(test1,test2,...)> [-C[=]<connect count>] [-N[=]<commond number>] [-F[=]<taskId>]]";
static  const   char *short_options = "hWH:P:A:T:F:C:N:S:";
static  struct option long_options[] = {
        {"help",     no_argument,        NULL,   0},
        {0, 0, 0, 0}
    };
