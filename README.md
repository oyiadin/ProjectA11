# ProjectA11
基于微信的移动智能学习平台

## Usage

### Preparation

1. `git clone https://github.com/oyiadin/ProjectA11` 因为仓库是私有的，所以克隆时应该需要登陆你的github账号

2. 安装 pipenv: `sudo pip install pipenv`

3. 安装运行所需环境 `pipenv install`

4. 激活开发环境 `pipenv shell` (要先 `cd` 到 `ProjectA11` 目录下)

5. 安装 `mysql`，自行百度

6. 创建用户: `create user 'test'@'%' identified by 'password'` (用户名密码可以改，但是要修改 `config.json` 文件) (反正是本地数据库，直接这样不改它就行) (本行在 `mysql -u root -p` 里运行)

7. 创建数据库: `create database project_a11_test;` (在 `mysql -u root -p` 里运行)

8. 授权: `grant all on project_a11_test.* to 'test'@'%';` (test改成你在第六步建的用户名，本行命令在mysql里运行)

9. 建表: `python manage.py --init` (在shell里运行)

### Run

程序入口在 `manage.py`，有两个运行模式:

* `python manage.py --server`
* `python manage.py --init`

注意每次运行前都要激活运行所需的环境 `pipenv shell`

`--server` 是运行服务器用的；`--init` 是建表用的，只需要第一次运行时跑一下。

服务器跑起来之后，去 [http://localhost:8888](http://localhost:8888) 就可以看到了。

如果其他人修改了数据库的表结构，需要删了对应的表，然后重新运行一下 `--init` (可以直接改吗，我 mysql 不是很熟悉)
