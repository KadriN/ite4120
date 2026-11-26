import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AppButtonPrimary, AppCard, useAppNotification } from '@helex/ui';
import { parkingApi, type ParkingApplication } from '../../api';

export const ParkingApplicationList = () => {
  const navigate = useNavigate();
  const notify = useAppNotification();
  const [applications, setApplications] = useState<ParkingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await parkingApi.list(pageSize, (page - 1) * pageSize);
      setApplications(result.data);
      setTotal(result.meta.total);
    } catch (error) {
      notify.error(
        'Could not load parking applications',
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  }, [notify, page, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns: ColumnsType<ParkingApplication> = [
    { title: 'Application', dataIndex: 'id', key: 'id' },
    { title: 'Personal identity code', dataIndex: 'personal_code', key: 'personal_code' },
    { title: 'Application date', dataIndex: 'application_date', key: 'application_date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ParkingApplication['status']) => (
        <Tag color={status === 'RECEIVED' ? 'blue' : 'green'}>{status}</Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason?: string | null) => reason || '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_value, application) => (
        <Button type="link" onClick={() => navigate(`/parking/applications/${application.id}`)}>
          Open
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
      <AppCard title="Accessible parking permit applications">
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AppButtonPrimary onClick={() => navigate('/parking/applications/new')}>
              Create application
            </AppButtonPrimary>
          </div>
          <Table<ParkingApplication>
            rowKey="id"
            columns={columns}
            dataSource={applications}
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: [10, 25, 50],
              showTotal: (count) => `${count} applications`,
              onChange: (nextPage, nextPageSize) => {
                if (nextPageSize !== pageSize) {
                  setPageSize(nextPageSize);
                  setPage(1);
                } else {
                  setPage(nextPage);
                }
              },
            }}
          />
        </Space>
      </AppCard>
    </div>
  );
};
