import React, { useState, useEffect } from 'react';
import { getNodeDetails } from '../utils/helpers';
import { FiActivity, FiServer, FiCpu, FiHardDrive } from 'react-icons/fi';

const NodeInfo = ({ nodeId }) => {
    const [nodeInfo, setNodeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNodeInfo = async () => {
            try {
                setLoading(true);
                const info = await getNodeDetails(nodeId);
                setNodeInfo(info);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNodeInfo();
    }, [nodeId]);

    if (loading) return <div>Loading node details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!nodeInfo) return <div>Node not found</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Node Details: {nodeId.substring(0, 12)}...</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <FiActivity className="w-5 h-5 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-500">Uptime</p>
                        <p className="text-lg font-semibold">{nodeInfo.uptime}%</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <FiServer className="w-5 h-5 text-green-500" />
                    <div>
                        <p className="text-sm text-gray-500">Version</p>
                        <p className="text-lg font-semibold">{nodeInfo.version}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <FiCpu className="w-5 h-5 text-purple-500" />
                    <div>
                        <p className="text-sm text-gray-500">Stake</p>
                        <p className="text-lg font-semibold">{formatStake(nodeInfo.stake)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <FiHardDrive className="w-5 h-5 text-yellow-500" />
                    <div>
                        <p className="text-sm text-gray-500">Storage</p>
                        <p className="text-lg font-semibold">{nodeInfo.storageUsed} / {nodeInfo.storageCapacity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};  