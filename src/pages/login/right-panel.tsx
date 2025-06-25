import { Flex, Typography } from 'antd';
import classNames from 'classnames';

import styles from './index.less';

const { Title, Text } = Typography;

const LoginRightPanel = () => {
  return (
    <section className={styles.rightPanel}>
      {/* <SvgIcon name="login-star" width={80}></SvgIcon> */}
      <Flex vertical gap={40}>
        <Title
          level={1}
          className={classNames(styles.white, styles.loginTitle)}
        >
          知识库平台
        </Title>
        <Text className={classNames(styles.pink, styles.loginDescription)}>
          创建知识库和人工智能来增强您的业务
        </Text>
        {/* <Flex align="center" gap={16}>
           <Avatars></Avatars>
          <Flex vertical>
            <Space>
              <Rate disabled defaultValue={5} />
              <span
                className={classNames(styles.white, styles.loginRateNumber)}
              >
                5.0
              </span>
            </Space>
            <span className={classNames(styles.pink, styles.loginRateReviews)}>
              {t('review')}
            </span>
          </Flex>
        </Flex> */}
      </Flex>
    </section>
  );
};

export default LoginRightPanel;
