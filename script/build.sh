sudo apt-get update
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get -y upgrade
sudo apt-get install -y python3-pip 
sudo pip3 install --upgrade pip
sudo pip3 install flask 
sudo pip3 install requests 
sudo pip3 install newspaper3k
sudo chown -R $(whoami) ~/.npm
sudo apt-get install -y build-essential

#es
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/6.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-6.x.list
sudo apt-get update && sudo apt-get install elasticsearch


sudo -i service elasticsearch start
sudo -i service elasticsearch stop
