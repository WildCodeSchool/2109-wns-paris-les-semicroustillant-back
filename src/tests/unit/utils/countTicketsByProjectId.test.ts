import countTicketsByProjectId from '../../../utils/countTicketsByProjectId';
import TicketModel from '../../../models/TicketModel';

describe('countTicketsById', () => {
  const projectId: string = '5e9f8f9f8f9f8f9f8f9f9f9';
  let status: string | null;

  it('should return the number of tickets by project id', async () => {
    status = null;

    TicketModel.countDocuments = jest.fn().mockResolvedValue(10);

    const res = await countTicketsByProjectId({ projectId, status });

    expect(res).toBe(10);
    expect(TicketModel.countDocuments).toHaveBeenCalledWith({
      project_id: '5e9f8f9f8f9f8f9f8f9f9f9',
    });
  });

  it('should return the number of tickets by project id with `Done` status', async () => {
    status = 'Done';

    TicketModel.countDocuments = jest.fn().mockResolvedValue(5);

    const res = await countTicketsByProjectId({ projectId, status });

    expect(res).toBe(5);
    expect(TicketModel.countDocuments).toHaveBeenCalledWith({
      project_id: '5e9f8f9f8f9f8f9f8f9f9f9',
      status: 'Done',
    });
  });
});
