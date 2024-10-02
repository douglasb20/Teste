  SET time_zone='America/Sao_Paulo';
  SET global time_zone='America/Sao_Paulo';

#
# Table structure for table 'customers'
#

CREATE TABLE IF NOT EXISTS `customers` (
  id bigint(21) NOT NULL auto_increment,
  costumer_uuid varchar(36) NOT NULL,
  customer_name varchar(90) NOT NULL,
  created_at datetime NOT NULL default CURRENT_TIMESTAMP,
  updated_at datetime NULL default NULL ON UPDATE CURRENT_TIMESTAMP,
  status tinyint(1) default 1,
  PRIMARY KEY (id)
);

#
# Table structure for table 'measures'
#

CREATE TABLE IF NOT EXISTS `measures` (
  id bigint(21) NOT NULL auto_increment,
  customer_id bigint(21) NOT NULL,
  measure_uuid varchar(64) NOT NULL,
  measure_datetime datetime  NOT NULL,
  measure_value int(9) NOT NULL,
  measure_type varchar(10) NOT NULL,
  has_confirmed tinyint(1) NULL default 0,
  image_url varchar(90) NOT NULL ,
  PRIMARY KEY  (id)
);

ALTER TABLE `measures` 
ADD INDEX `customer_id_fk_idx` (`customer_id` ASC);

ALTER TABLE `measures` 
ADD CONSTRAINT `measures_customer_id_fk`
  FOREIGN KEY (`customer_id`)
  REFERENCES `customers` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

INSERT INTO
customers(costumer_uuid, customer_name)
values('a164c203-3767-45ff-904e-1e885e2e523c', "Douglas A. Silva");
