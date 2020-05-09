#include <iostream>
#include <unistd.h>
#include <string.h>
#include <time.h>
#include <fcntl.h>
#include <syslog.h>
#include <stdarg.h>


using namespace std;



#define MAX_LOG_LENGTH 1024
const string LV[6] = {"Fatal","Error","Warn","Info","Trace","Debug"};
class Logpro
{
public:
	Logpro();
	~Logpro();
	
	void log_print(int level,string module,string tmp);
	void log_print(int level,const char*  module,const char*  tmp);
	void logPrint(int level,const char* module,const char* pszFormat, ...);
	void	set_log_path(const char* log_path);
	void	set_level_init(int level_init);
	void	set_to_file(bool);
	void	set_to_syslog(bool);
private:
	void	logpro_init();

	
	void 	set_date();
	void	set_process();
	void 	number_add();
	void	set_level(int level);
	void	set_module(string module);
	void	set_tmp(string tmp);
	void	set_log();
	
	void	clear();
	

private:
	string	date;
	string  process;
	string 	number;
	string	level;
	string	module;
	string 	tmp;
	string 	file_log;
	string  sys_log;

	int 	level_init;
	string	log_path;
	bool	to_file;
	bool	to_syslog;

};

