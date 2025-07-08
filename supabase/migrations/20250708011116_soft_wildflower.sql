@@ .. @@
 INSERT INTO system_config (config_key, config_value, description) VALUES
 ('sms_price_per_60_chars', '1.00', '每60字符短信价格（元）'),
 ('wechat_merchant_id', '', '微信商户号'),
 ('wechat_merchant_key', '', '微信商户密钥'),
 ('aliyun_access_key_id', '', '阿里云AccessKeyId'),
 ('aliyun_access_key_secret', '', '阿里云AccessKeySecret'),
-('aliyun_sms_sign_name', '', '阿里云短信签名'),
+('aliyun_sms_sign_name', '飞鸟飞信', '阿里云短信签名'),
 ('aliyun_sms_template_code', '', '阿里云短信模板代码');