import { api_host } from '@/utils/api';
import { Popover } from 'antd';
import classNames from 'classnames';
import {

  Image,

} from 'antd';
import styles from './index.less';

interface IImage {
  id: string;
  className: string;
  type?: boolean;
  onClick?(): void;
}

const MyImage = ({ id, className,type, ...props }: IImage) => {

    if(!type){
      return (
        <Image
        {...props}
        src={`${api_host}/document/image/${id}`}
        alt=""
        className={classNames(styles.primitiveImg, className)}
      />
      )
    }else{
      return (
        <img
        {...props}
        src={`${api_host}/document/image/${id}`}
        alt=""
        className={classNames(styles.primitiveImg, className)}
      />
      )
    }
   
};

export default MyImage;

export const ImageWithPopover = ({ id }: { id: string }) => {
  return (
    <Popover
      placement="left"
      content={<MyImage id={id} className={styles.imagePreview}></MyImage>}
    >
      <MyImage id={id} className={styles.image}></MyImage>
    </Popover>
  );
};
