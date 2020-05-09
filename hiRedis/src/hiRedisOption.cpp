#include "../include/hiRedisOption.hpp"
HiRedisOption::HiRedisOption()
{

}
HiRedisOption::~HiRedisOption()
{

}
HiRedisOption::HiRedisOption(int argc,char **argv)
{
    init();
    int opt = -1;
    int lopt = -1;
    int optIndex = 0;
    string tmp;
    while(1)
    {
        opt = getopt_long(argc, argv,short_options, long_options, &optIndex);
        if(opt == -1)
        {
             break;
        }
        switch (opt)
        {
            case 0:
                switch(opt)
                {
                    case 0:
                        showHelp();
                        return;
                    default:
                        cout<<"Unknown option"<<endl;
                        return;
                } 
                break;
            case 'h':
                showHelp();
                return;
            case 'H':
                this->host = argv[optind - 1];
                break;
            case 'P':
                tmp = argv[optind - 1];
                this->port = atoi(tmp.c_str());
                break;
	    case 'A':
		this->password = argv[optind - 1];
		break;
            case 'C':
                tmp = argv[optind - 1];
                this->connectCount = atoi(tmp.c_str());
                break;
            case 'N':
                tmp = argv[optind - 1];
                this->requestCount = atoi(tmp.c_str());
                break;
            case 'S' :
                tmp = argv[optind - 1];
                this->valueSize = atoi(tmp.c_str());
                break;
            case 'T' :
                this->commandList = argv[optind - 1];
                break;
            case 'F' :
                this->taskId = argv[optind - 1];
                break;
            default:
                cout<<"Unknown option"<<endl;
                return;
        }
    }
    if(this->taskId.length() > 0)
    {
        this->isCommondTrue = true;
    }
    else
    {
        cout<<"no taskId"<<endl;
    }
}


void    HiRedisOption::init()
{
    this->taskId = "";
    this->host = "localhost";
    this->port = 6379;
    this->password = "";
    this->connectCount = 50;
    this->requestCount = 10000;
    this->valueSize = 2;
    this->commandList = "";
    this->isCommondTrue = false;
}
void    HiRedisOption::showHelp()
{
	cout<<helpInfo<<endl;
}

string  HiRedisOption::gettaskId()
{
    return this->taskId;
}
string  HiRedisOption::gethost()
{
    return this->host;
}
int     HiRedisOption::getport()
{
    return this->port;
}
string 	HiRedisOption::getPassword()
{
	return this->password;
}
int     HiRedisOption::getconnectCount()
{
    return this->connectCount;
}
int     HiRedisOption::getrequestCount()
{
    return this->requestCount;
}
int     HiRedisOption::getvalueSize()
{
    return this->valueSize;
}
string  HiRedisOption::getcommandList()
{
    return this->commandList;
}
bool    HiRedisOption::getisCommondTrue()
{
    return this->isCommondTrue;
}
