import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, DatePicker, Form, Input, Select, Space, Tag } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AppButtonPrimary, AppCard, useAppNotification } from '@helex/ui';
import { parkingApi, type ParkingApplicationDetails } from '../../api';

export const ParkingApplicationDetail = () => {
  const { id } = useParams();
  const applicationId = Number(id);
  const navigate = useNavigate();
  const notify = useAppNotification();
  const [application, setApplication] = useState<ParkingApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingDecision, setSavingDecision] = useState(false);
  const [issuingPermit, setIssuingPermit] = useState(false);
  const [decisionForm] = Form.useForm<{
    decisionDate: Dayjs;
    decisionType: 'APPROVED' | 'REJECTED';
    decisionReason?: string;
  }>();
  const [permitForm] = Form.useForm<{ validFrom: Dayjs; validUntil: Dayjs }>();

  const load = useCallback(async () => {
    if (!Number.isSafeInteger(applicationId) || applicationId <= 0) {
      notify.error('Could not load the application', 'The application ID is invalid.');
      navigate('/parking/applications');
      return;
    }

    setLoading(true);
    try {
      const details = await parkingApi.get(applicationId);
      setApplication(details);
    } catch (error) {
      notify.error(
        'Could not load the application',
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
      navigate('/parking/applications');
    } finally {
      setLoading(false);
    }
  }, [applicationId, navigate, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  const recordDecision = async (values: {
    decisionDate: Dayjs;
    decisionType: 'APPROVED' | 'REJECTED';
    decisionReason?: string;
  }) => {
    setSavingDecision(true);
    try {
      await parkingApi.recordDecision(applicationId, {
        decision_date: values.decisionDate.format('YYYY-MM-DD'),
        decision_type: values.decisionType,
        decision_reason: values.decisionReason || undefined,
      });
      notify.success('Decision recorded', `Application ${applicationId} is now decided.`);
      await load();
    } catch (error) {
      notify.error(
        'Could not record the decision',
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    } finally {
      setSavingDecision(false);
    }
  };

  const issuePermit = async (values: { validFrom: Dayjs; validUntil: Dayjs }) => {
    setIssuingPermit(true);
    try {
      await parkingApi.issuePermit(applicationId, {
        valid_from: values.validFrom.format('YYYY-MM-DD'),
        valid_until: values.validUntil.format('YYYY-MM-DD'),
      });
      notify.success('Permit issued', 'The active parking permit is now available.');
      await load();
    } catch (error) {
      notify.error(
        'Could not issue the permit',
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    } finally {
      setIssuingPermit(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Button type="link" onClick={() => navigate('/parking/applications')}>
            Back to applications
          </Button>
        </div>
        <AppCard title={`Parking permit application ${id ?? ''}`}>
          {loading && <p>Loading application…</p>}
          {!loading && application && (
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <p><b>Applicant personal identity code:</b> {application.personal_code}</p>
                <p><b>Application date:</b> {application.application_date}</p>
                <p><b>Application status:</b> <Tag>{application.status}</Tag></p>
                <p><b>Reason:</b> {application.reason || '—'}</p>
              </div>

              <section>
                <h2>Decision</h2>
                {application.decision ? (
                  <div>
                    <p>
                      <b>Outcome:</b>{' '}
                      <Tag color={application.decision.decision_type === 'APPROVED' ? 'green' : 'red'}>
                        {application.decision.decision_type}
                      </Tag>
                    </p>
                    <p><b>Decision date:</b> {application.decision.decision_date}</p>
                    <p><b>Reason:</b> {application.decision.decision_reason || '—'}</p>
                  </div>
                ) : (
                  <Form
                    form={decisionForm}
                    layout="vertical"
                    initialValues={{ decisionDate: dayjs(), decisionType: 'APPROVED' }}
                    onFinish={recordDecision}
                  >
                    <Form.Item
                      name="decisionType"
                      label="Decision"
                      rules={[{ required: true }]}
                    >
                      <Select
                        options={[
                          { value: 'APPROVED', label: 'Approve application' },
                          { value: 'REJECTED', label: 'Reject application' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name="decisionDate"
                      label="Decision date"
                      rules={[{ required: true, message: 'Please select the decision date' }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="decisionReason"
                      label="Decision reason (optional)"
                      rules={[{ max: 500, message: 'Reason must not exceed 500 characters' }]}
                    >
                      <Input.TextArea rows={3} maxLength={500} showCount />
                    </Form.Item>
                    <AppButtonPrimary htmlType="submit" loading={savingDecision}>
                      Record decision
                    </AppButtonPrimary>
                  </Form>
                )}
              </section>

              <section>
                <h2>Parking permit</h2>
                {application.permit ? (
                  <div>
                    <p><b>Permit number:</b> {application.permit.permit_number}</p>
                    <p><b>Valid from:</b> {application.permit.valid_from}</p>
                    <p><b>Valid until:</b> {application.permit.valid_until}</p>
                    <p><b>Status:</b> <Tag color="green">{application.permit.status}</Tag></p>
                  </div>
                ) : application.decision?.decision_type === 'APPROVED' ? (
                  <Form
                    form={permitForm}
                    layout="vertical"
                    initialValues={{
                      validFrom: dayjs(),
                      validUntil: dayjs().add(1, 'year'),
                    }}
                    onFinish={issuePermit}
                  >
                    <Form.Item
                      name="validFrom"
                      label="Valid from"
                      rules={[{ required: true, message: 'Please select the start date' }]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="validUntil"
                      label="Valid until"
                      dependencies={['validFrom']}
                      rules={[
                        { required: true, message: 'Please select the end date' },
                        ({ getFieldValue }) => ({
                          validator(_, value: Dayjs | undefined) {
                            const validFrom = getFieldValue('validFrom') as Dayjs | undefined;
                            if (!value || !validFrom || !value.isBefore(validFrom, 'day')) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('The end date must not be earlier than the start date'),
                            );
                          },
                        }),
                      ]}
                    >
                      <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <AppButtonPrimary htmlType="submit" loading={issuingPermit}>
                      Issue parking permit
                    </AppButtonPrimary>
                  </Form>
                ) : application.decision?.decision_type === 'REJECTED' ? (
                  <Alert
                    type="info"
                    showIcon
                    title="A permit cannot be issued because this application was rejected."
                  />
                ) : (
                  <Alert
                    type="info"
                    showIcon
                    title="Record an approved decision before issuing a permit."
                  />
                )}
              </section>
            </Space>
          )}
        </AppCard>
      </Space>
    </div>
  );
};
