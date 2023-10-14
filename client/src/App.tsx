import { Layout } from 'antd';
import './App.css';
import TableComponent from './components/TableComponent';
import { Content } from 'antd/es/layout/layout';

const App=()=> {
  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 520,
    lineHeight: '520px',
    color: '#fff',
    position:'relative'
  };
  return (
    <>
      <Layout>
        <Content style={contentStyle}>
          <TableComponent/>
        </Content>
      </Layout>
    </>
  );
}

export default App;
