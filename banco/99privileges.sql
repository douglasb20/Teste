CREATE USER IF NOT EXISTS `sysmeter`@'172.18.0.5' IDENTIFIED BY 'Lh;G&!mTuz';
ALTER USER 'sysmeter'@'172.18.0.5';
GRANT ALL PRIVILEGES ON `sysmeterdb`.* TO 'sysmeter'@'172.18.0.5';