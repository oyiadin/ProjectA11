# ProjectA11

基于微信的移动智能学习平台

## Usage

### Preparation

1. `git clone https://github.com/oyiadin/ProjectA11` 因为仓库是私有的，所以克隆时应该需要登陆你的github账号

2. 安装 pipenv: `sudo pip install pipenv`

3. 安装运行所需环境 `pipenv install`

4. 激活开发环境 `pipenv shell` (要先 `cd` 到 `ProjectA11` 目录下)

5. 安装 `mysql`，自行百度

6. 创建用户: `create user 'test'@'%' identified by 'password';` (用户名密码可以改，但是要修改 `config.json` 文件) (反正是本地数据库，直接这样不改它就行) (本行在 `mysql -u root -p` 里运行)

7. 创建数据库: `create database project_a11_test;` (在 `mysql -u root -p` 里运行)

8. 授权: `grant all on project_a11_test.* to 'test'@'%';` (test改成你在第六步建的用户名，本行命令在mysql里运行)

9. 建表: `python manage.py --init` (在shell里运行)

10. 安装 `redis`，自行百度，装完把 `redis-server` 打开 (默认配置即可，反正只是本地测试环境)

11. `redis`设置了密码,密码为`4d46745a30d006b9cbbd90005f50075764ccc67c53fade810b4f43d644acab4d`。
如果要在本地跑的话，需要设置下密码：
```bash
> config set requirepass 4d46745a30d006b9cbbd90005f50075764ccc67c53fade810b4f43d644acab4d
```
想登录`redis`可以使用：
```bash
$ redis-cil -h 127.0.0.1 -p 6379 -a 4d46745a30d006b9cbbd90005f50075764ccc67c53fade810b4f43d644acab4d
```


### Run

程序入口在 `manage.py`，有两个运行模式:

* `python manage.py --server`
* `python manage.py --init`

注意每次运行前都要激活运行所需的环境 `pipenv shell`

注意要把 `celery` 开起来：`celery worker -b redis://@localhost:6379/0 --loglevel=debug -A projecta11.celery_tasks`

`--server` 是运行服务器用的；`--init` 是建表用的，只需要第一次运行时跑一下。

服务器跑起来之后，去 [http://localhost:8888](http://localhost:8888) 就可以看到了。

如果其他人修改了数据库的表结构，需要删了对应的表，然后重新运行一下 `--init` (可以直接改吗，我 mysql 不是很熟悉)

`--server` 模式有一个额外的开关 `--swagger-ui`，开启之后可以在本地看到 API 文档。

## Dependent Libraries

根据赛题文档，所使用的开源库必须进行标注：

* [tornado](https://github.com/tornadoweb/tornado/blob/master/LICENSE) (Apache License 2.0)
* [sqlalchemy](https://github.com/zzzeek/sqlalchemy/blob/master/LICENSE) (MIT)
* [pymysql](https://github.com/PyMySQL/PyMySQL/blob/master/LICENSE) (MIT)
* [vuejs](https://github.com/vuejs/vue/blob/dev/LICENSE) (MIT)
* [bootstrap](https://getbootstrap.com/docs/4.2/about/license/) (MIT)
* [jQuery](https://github.com/jquery/jquery/blob/master/LICENSE.txt)(MIT)
* [pillow](https://github.com/python-pillow/Pillow/blob/master/LICENSE) (PIL协议，类似MIT)
* [redis](https://redis.io/topics/license/) (BSD)
* [swagger-ui-py](https://github.com/PWZER/swagger-ui-py) (Apache License 2.0)
* [captcha](https://github.com/lepture/captcha) (BSD)
* [celery](https://github.com/celery/celery/blob/master/LICENSE) (BSD-3-Clause)