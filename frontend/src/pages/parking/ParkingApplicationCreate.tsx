
import { AppCard, AppButtonPrimary, useAppNotification } from '@helex/ui';
import { Button, Form, Input, DatePicker } from 'antd';
import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { parkingApi } from '../../api';

export const ParkingApplicationCreate = () => {
  const notify = useAppNotification();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const submit = async (values: {
    personalCode: string;
    applicationDate: Dayjs;
    reason?: string;
  }) => {
    setSaving(true);

    try {
      await parkingApi.create({
        personal_code: values.personalCode,
        application_date: values.applicationDate.format('YYYY-MM-DD'),
        reason: values.reason || undefined,
      });

      notify.success(
        'Application created',
        'The parking permit application was saved.'
      );
      navigate('/parking/applications');
    } catch (error) {
      notify.error(
        'Could not create application',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppCard title="Create a parking permit application" style={{ maxWidth: 720, margin: '24px auto' }}>
      <p>Enter the applicant's details to create a new application.</p>

      <Form layout="vertical" onFinish={submit}>
        <Form.Item
          name="personalCode"
          label="Personal identity code"
          rules={[
            {
              required: true,
              message: 'Please enter a personal identity code',
            },
            {
              pattern: /^\d{11}$/,
              message: 'The personal identity code must contain exactly 11 digits',
            },
          ]}
        >
          <Input placeholder="Enter the applicant's 11-digit personal code" />
        </Form.Item>

        <Form.Item
          name="applicationDate"
          label="Application date"
          rules={[
            {
              required: true,
              message: 'Please select an application date',
            },
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason (optional)"
          rules={[
            {
              max: 500,
              message: 'Reason must not exceed 500 characters',
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            maxLength={500}
            showCount
            placeholder="Enter the reason for the application (optional)"
          />
        </Form.Item>

        <Form.Item>
          <AppButtonPrimary htmlType="submit" loading={saving}>
            Create application
          </AppButtonPrimary>
        </Form.Item>
      </Form>
      <Button type="link" onClick={() => navigate('/parking/applications')}>
        Back to applications
      </Button>
    </AppCard>
  );
};